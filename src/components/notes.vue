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
                    <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
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
                                        <input class="form-control" type="text" placeholder="Title" v-model="takeNote.title" @focus="onFocus = true" @blur="onFocus = false">
                                    </div>
                                    <div>
                                        <input class="form-control" type="textarea" placeholder="Take a note..." v-model="takeNote.note">
                                    </div>
                                    <div class="form-group">
                                        <section>
                                            <div class="row">
                                                <div class="col-sm-1">

                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </article>
                    <article class="row">
                        <section class="container">
                            <div class="wrapper-notes col-md-9" v-if="notesList.length > 0">
                                <div class="col-md-3 col-sm-6 note-card" v-bind:key="`${note.id}_${ind}`" v-for="(note, ind) in notesList">
                                    <div>{{note.title}}</div>
                                    <p>{{note.note}}</p>
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
            user: {}
        }
    },
    mounted () {
        if (localStorage.getItem('session') != null) {
            this.user = JSON.parse(localStorage.getItem('session'))
            let fullList = localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes')) : null;
            if (fullList !== null) {
                if (fullList.hasOwnProperty(this.user.id)){
                    this.notesList  = fullList[this.user.id];
                }
            }
        }
    },
    watch: {
        takeNote: {
            self: this,
            handler: function (_changeObject, __previous) {
                let self = this
                self.onChange(self.saveNote, 3000)();
            },
            deep: true
        }
    },
    methods: {
        searchNotes () {

        },
        saveNote (context) {
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
            if(this.noteId != null){
                this.noteId = null
                this.takeNote = {
                    title: null,
                    note: null,
                    link: null,
                    image: null,
                    map: null,
                    status: false
                }
            }
        },
        logOut (event) {
            localStorage.removeItem('session')
            this.$router.push('/login')
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
    padding: 8px;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    min-height: 116px;
    margin: 16px;
}
.note-card:hover{
    box-shadow: 0 2px 2px 0 #f1f1f1;
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
</style>
