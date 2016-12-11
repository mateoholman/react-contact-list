import React, { Component } from 'react';
import ContactList from './ContactList';
import SearchBar from './SearchBar';
import ContactForm from './ContactForm';
import axios from 'axios';

class App extends Component {
  constructor() {
    super();

    this.state = {
      searchText: '',
      contacts: []
    };
  }

  componentDidMount() {
    axios.get('/api/contacts')
      .then(resp => {
        this.setState({
          searchText: this.state.searchText,
          contacts: resp.data
        })
      })
      .catch(err => console.log(`Error! ${err}`));
  }

  handleSearchBarChange(event) {
    this.setState({
      contacts: this.state.contacts,
      searchText: event.target.value
    })
  }

  getFilteredContacts() {
    //Remove any whitespace and convert to lower case.
    const term = this.state.searchText.trim().toLowerCase();
    const contacts = this.state.contacts;

    //If our term is an empty string, we want to return all the contacts
    if(!term){
      return contacts;
    }

    //Filter through our contacts
    return contacts.filter(contact => {
      return contact.name.toLowerCase().search(term) >= 0;
    });
  }

  handleAddContact(attributes) {
    axios.post('/api/contacts', attributes)
      .then(resp => {
        this.setState(prev => {
          return {
            ...prev,
            contacts: [...prev.contacts, resp.data]
          };
        });
      })
      .catch(err => console.log(err));
  }

  handleDelContact(contactId) {
    //Get the current contact list
    const contacts = this.state.contacts;
    //Find the index of the contact that we want to delete
    const index = contacts.map((person) => person._id).indexOf(contactId);
    //Create a new contacts array without the contact we want to delete
    const newContacts = contacts.slice(0, index).concat(contacts.slice(index+1));
    //Update the Contact List with the new contacts array
    //this.setState({contacts: newContacts});

    axios.delete(`/api/contacts/${contactId}`)
      .then(resp => {
        this.setState(prev => {
          return {
            ...prev,
            contacts: newContacts
          };
        });
      })
      .catch(err => console.log(err));

  }

  render() {
    return (
      <div className="App">
        <h1>Contacts</h1>
        <div className='contactForm'>
          <ContactForm onAdd={this.handleAddContact.bind(this)}/>
        </div>
        <SearchBar value={this.state.searchText} onChange={this.handleSearchBarChange.bind(this)} />
        <ContactList contacts={this.getFilteredContacts()} handleDelContact={this.handleDelContact.bind(this)}/>
      </div>
    );
  }

}

export default App;
