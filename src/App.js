import React, { Component } from "react";
import "./App.css";
import { Card, Icon, Input, Form, TextArea, Button, Grid } from "semantic-ui-react";

// utility libs
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";

// amplify libs
import Amplify from "aws-amplify";
import config from "./aws-exports";
import { withAuthenticator } from "aws-amplify-react";
import API, { graphqlOperation } from "@aws-amplify/api";

// graphql queries, mutations and subscription imports
import { createNote } from "./graphql/mutations";
import { listNotes } from "./graphql/queries";
import { onCreateNote } from "./graphql/subscriptions";

// configure amplify
Amplify.configure(config);

class App extends Component {
  state = {
    note: { title: "", text: "", date: "" },
    notes: []
  };

  componentDidMount = async () => {
    // get notes from backend
    const notes = await API.graphql(graphqlOperation(listNotes));
    this.setState({ notes: notes.data.listNotes.items });

    // listen for new notes
    API.graphql(graphqlOperation(onCreateNote)).subscribe({
      next: eventData => {
        const note = eventData.value.data.onCreateNote;
        this.setState({
          notes: [...this.state.notes, note]
        });
      }
    });
  };

  handleChange = (name, { target }) => {
    this.setState({
      note: {
        ...this.state.note,
        [name]: target.value
      }
    });
  };

  handleAddNoteClick = () => {
    this.setState(
      {
        note: { ...this.state.note, id: uuid(), date: dayjs() }
      },
      async () => {
        await API.graphql(graphqlOperation(createNote, { input: this.state.note }));
        // this.setState({
        //   notes: [...this.state.notes, this.state.note]
        // });
      }
    );
  };

  render() {
    return (
      <Form>
        <Input fluid placeholder="Title" size="big" onChange={this.handleChange.bind(this, "title")} />
        <TextArea
          placeholder="Type your note here"
          onChange={this.handleChange.bind(this, "text")}
          value={this.state.text}
        />
        <Button fluid color="green" size="large" onClick={this.handleAddNoteClick}>
          Add Note
        </Button>

        {/* Show list of notes  */}
        <Grid stackable padded columns={4}>
          {this.state.notes.map(note => (
            <Grid.Column key={note.id}>
              <Card fluid>
                <Card.Content>
                  <Card.Header>{note.title}</Card.Header>
                  <Card.Description>{note.text}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Icon name="calendar" />
                  {dayjs(note.date).format("DD-MMM-YYYY, h:mm:ss a")}
                </Card.Content>
              </Card>
            </Grid.Column>
          ))}
        </Grid>
      </Form>
    );
  }
}

export default withAuthenticator(App, true);
