import React, { Component } from "react";
import "./App.css";
import { Card, Icon, Input, Form, TextArea, Button, Grid } from "semantic-ui-react";

// utility libs
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";

class App extends Component {
  state = {
    note: { title: "", text: "", date: null },
    notes: []
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
      () => {
        this.setState({
          notes: [...this.state.notes, this.state.note]
        });
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
                  {note.date.format("DD-MMM-YYYY, h:mm:ss a")}
                </Card.Content>
              </Card>
            </Grid.Column>
          ))}
        </Grid>
      </Form>
    );
  }
}

export default App;
