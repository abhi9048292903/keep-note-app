<template>
  <div>
      <header>
        <nav class="navbar navbar-expand-lg bg-dark">
             <a class="navbar-brand" href="#">Notes</a>
            <div class="collapse navbar-collapse">
                <ul class=" navbar-nav mr-auto pull-right">
                    <li class="li-padding">
                         <a href="">Hello {{user.name}}</a>
                    </li>
                    <li class="li-padding" @click="logOut">
                         <a href="">Log out</a>
                    </li>
                </ul>
                <form class="form-inline my-pad my-lg-0" @submit.prevent="searchNotes">
                    <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search notes" v-model="searchInput" v-on:keyup="searchNotes">
                </form>
            </div>
            
        </nav>
      </header>
      <main>
          <div class="container-fluid" @click="editOutFocus">
            <div class="row">
                <aside class="col-md-3">
                    <div class="tabs">
                        <ul class="group-list">
                            <li class="group-list-item active">
                                <a>
                                   <span>Notes</span> 
                                </a>
                            </li>
                        </ul>
                    </div>
                </aside>
                <section class="col-md-9">
                    <article class="row">
                        <div class="col-md-offset-3 col-md-7">
                            <form >
                                <div class="form-group edit-field" @click="initTakeNote" >
                                    <input v-model="noteId" hidden>
                                    <div class="form-group">
                                        <input class="form-control" type="text" :placeholder="(onFocus ? 'Title': 'Take a note...')" v-model="takeNote.title" @focus="onFocus = true">
                                    </div>
                                    <div v-if="onFocus">
                                        <input class="form-control" type="textarea" placeholder="Take a note..." v-model="takeNote.note">
                                        <div class="form-group" style="margin-top: 8px; margin-bottom:8px;">
                                            <section>
                                                <div class="row">
                                                    <div class="container pd-12">
                                                        <div class="col-md-1" v-if="!linkInput">
                                                            <button class="btn btn-default btn-xs" @click="linkInput = true">
                                                                 Add link
                                                            </button>
                                                        </div>
                                                        <div class="col-md-3" v-if="linkInput">
                                                            <input style="border:1px solid #F1F1F1; padding:0 4px; border-radius:3px; font-size:12px;" type="text" v-model="takeNote.link" placeholder="Note link">
                                                        </div>
                                                        
                                                    </div>
                                                </div>
                                            </section>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </article>
                    <article class="row">
                        <section class="container">
                            <div class="wrapper-notes col-md-9" v-if="notesList.length > 0" @click="noteClickEvent">
                                <div class="col-md-3 col-sm-6 note-card" v-bind:key="`${note.id}_${ind}`" v-for="(note, ind) in notesList">
                                    <div :class="(note.status ? 'tick active': 'tick')">
                                        <input type="checkbox" hidden class="note-check" :id="note.id">
                                        <label :for="note.id" title="Mark as done" :data-id="note.id" :data-index="ind"></label>
                                    </div>
                                    <div class="title">{{note.title}}</div>
                                    <p>{{note.note}}</p>
                                    <a :href="note.link">{{note.link}}</a>
                                </div>
                            </div>
                        </section>                
                    </article>
                </section>
            </div>
          </div>
      </main>
    
  </div>
</template>

<script>
export default {
    data () {
        return {
            baseNotesList: [],
            notesList: [],
            takeNote: {
                title: null,
                note: null,
                link: null,
                image: null,
                map: null,
                status: false
            },
            noteId: null,
            onFocus: false,
            user: {},
            linkInput: false,
            searchInput: null
        }
    },
    mounted () {
        if (localStorage.getItem('session') != null) {
            this.user = JSON.parse(localStorage.getItem('session'))
            this.fetchData();
        }
    },
    created() {
        let self = this
        this.$root.$on('save-after-out-focus', function() {
            self.noteId = null
            self.takeNote = {
                title: null,
                note: null,
                link: null,
                image: null,
                map: null,
                status: false
            }
            self.linkInput = false;
            self.fetchData();
        })
    },
    watch: {
        takeNote: {
            self: this,
            handler: function (__previous, _changeObject) {
                let self = this
                if (_changeObject.name == null && _changeObject.title == null) {
                    return;
                }
                self.onChange(self.saveNote, 3000)();

            },
            deep: true
        },
        searchInput: function(_val){
            if (_val != null && _val !== ""){
                this.onChange(this.searchNotes, 400)();
            } else {
                this.notesList = this.baseNotesList.slice()
            }
        }
    },
    methods: {
        searchNotes () {
            let _searchText = this.searchInput != null ? this.searchInput.toLowerCase() : null
            this.notesList = this.notesList.filter((note) => {
                if(note.title != null || note.note != null){
                    let title = note.title != null ? note.title : '';
                    let text = note.note != null ? note.note : ''
                    return title.toLowerCase().includes(_searchText) || text.toLowerCase().includes(_searchText);
                }
            })
            if (_searchText == null || this.searchInput == null) {
                this.notesList = this.baseNotesList.slice();
            }

        },
        saveNote (context, when) {
            // save notes to local storage
            let self = this
            let notes = localStorage.getItem('notes') ? localStorage.getItem('notes') : null
            if(notes != null) {
                notes = JSON.parse(notes);
                if (notes.hasOwnProperty(self.user.id)) {
                    let user_notes = notes[self.user.id];
                    function isExist(element) {
                        return element.id === self.noteId;
                    }
                    let index = user_notes.findIndex(isExist)
                    if(index > -1) {
                        Object.assign(user_notes[index], self.takeNote);
                        notes[self.user.id] = user_notes 
                        notes = JSON.stringify(notes)
                        localStorage.setItem('notes', notes);
                    } else {
                        // not exists new
                        let newNote = {
                            id: self.noteId
                        }
                        Object.assign(newNote, self.takeNote);
                        user_notes.push(newNote);
                        notes[self.user.id] =  user_notes
                        notes = JSON.stringify(notes)
                        localStorage.setItem('notes', notes);
                    }
                } else {
                    notes[self.user.id] = [];
                    let freshNote = [];
                    freshNote.push(Object.assign({id: self.noteId}, self.takeNote))
                    notes[self.user.id] = freshNote 
                    notes = JSON.stringify(notes)
                    localStorage.setItem('notes', notes);
                }
            } else {
                let notes = {}
                notes[self.user.id] = [];
                let freshNote = [];
                freshNote.push(Object.assign({id: self.noteId}, self.takeNote))
                notes[self.user.id] = freshNote 
                notes = JSON.stringify(notes)
                localStorage.setItem('notes', notes);
            }
            if (when === 'user-out-focus') {
                this.$root.$emit('save-after-out-focus', 'fetch')
            }
        },
        onChange (foo, delay) {
            let self = this
            let debounceTimer;
            return function() {
                const context = this
                const args = arguments;
                clearTimeout(debounceTimer)
                debounceTimer = setTimeout(()=>{
                    foo.apply(context, args)
                },delay)
            }
        },
        initTakeNote (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            if (this.noteId === null) {
                let date = new Date();
                this.noteId = date.getTime() + "_note"
            } else{
                return
            }
        },
        editOutFocus () {
            event.preventDefault();
            this.onFocus = false;
            if(this.noteId != null){
                if (this.takeNote.title != null || this.takeNote.note != null) {
                    this.saveNote(this, 'user-out-focus')
                }
            }
        },
        logOut (event) {
            localStorage.removeItem('session')
            this.$router.push('/login')
        },
        fetchData () {
            let fullList = localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes')) : null;
            if (fullList !== null) {
                if (fullList.hasOwnProperty(this.user.id)){
                    let _list  = fullList[this.user.id];
                    _list = _list.filter((iterator)=>{
                        return iterator.id !== null
                    })
                    this.notesList = _list.sort(function(a, b){
                        if (a.id != null && b.id != null) {
                            return b.id.split('_')[0] - a.id.split('_')[0]
                        }
                    })
                    this.baseNotesList = _list;
                }
            }
        },
        noteClickEvent (event) {
            event.preventDefault();
            let target = event.target
            if (target.tagName !== 'LABEL'){
                return;
            }
            let noteId = target.getAttribute('data-id');
            let index = target.getAttribute('data-index')
            this.notesList[index].status = true;
            // save to local
            let fullList = localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes')) : null;
            if (fullList !== null) {
                if (fullList.hasOwnProperty(this.user.id)){
                    fullList[this.user.id] = this.notesList
                    localStorage.setItem('notes', JSON.stringify(fullList))
                   
                }
            }

        }
    }
  
 
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
aside{
    padding-left: 0;
}
a{
    text-decoration: none;
    color: #2E3036;
}
ul{
    list-style: none;
    padding-inline-start: 0;
}
.my-pad{
    padding: 8px 100px;
}
.li-padding{
    padding: 12px 6px;
}
.pd-12{
    padding-left: 12px;
}
.bg-dark {
    height: 50px;
    border-bottom: 1px solid #e0e0e0;
    color: #2E3036;
}
.navbar{
    border-radius: 0;
    z-index: 100;
}
.navbar a {
    text-decoration: none;
    color: #2E3036;
}
.group-list {
    padding-bottom: 32px;
    border-bottom: 1px solid #F1F1F1;
}
.group-list .group-list-item {
    padding: 8px 16px 8px 32px;
    font-weight: 500;
    font-size: 16px;
    border-top-right-radius:5px;
    border-bottom-right-radius: 5px;
    cursor: pointer;
}
.group-list-item.active {
    background-color: #feefc3;
}
.note-card {
    position: relative;
    padding: 16px;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    min-height: 116px;
    margin: 16px;
    cursor: pointer;
}
.note-card:hover{
    box-shadow: 0 4px 4px 0 #f1f1f1;
}
.note-card .title {
    font-size: 24px;
    font-weight: 600;
}
.note-card p{
    margin: 2px 0;
}
.note-card a {
    color: #0070DC;
    font-size: 13px;
    text-overflow: ellipsis;
    text-decoration: none;
}
.note-card .tick {
    position: absolute;
    left: -5px;
    top: -10px;
    display: none;
}
.note-card .tick label{
    cursor: pointer;
    text-align: center;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background-color: #2E3036;
    color: #F6F9FF;
}
.note-card .tick.active label {
    background-color: #008000;
    color: #fff;
}
.note-card .tick.active{
    display: block;
}
.note-card .tick label::after{
    content: "\2713";
}
.note-card:hover .tick{
   display: block;
}
.edit-field {
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    padding: 6px 4px;
}
.edit-field input{
    border-color: transparent;
    outline: none;
    -webkit-box-shadow: none;
}
.edit-field input:focus{    
    border-color: transparent;
    outline: 0;
    -webkit-box-shadow: none;
    box-shadow: none;
}
.edit-field .form-group{
    margin-bottom: 0;
}
</style>
