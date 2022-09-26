import React, { Component } from 'react';
import Metafield from '../resource/metafield';
import classNames from 'classnames';
import Input from './Input';
import Todo from './Todo';
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from 'constants/FilterTypes';

const filters = [
    { state: SHOW_ALL, label: "All"},
    { state: SHOW_ACTIVE, label: "Active"},
    { state: SHOW_COMPLETED, label: "Completed"}
]

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            metafields: [],
            filter: SHOW_ALL
        };
        this.fetch()
    }

    fetch() {
        Metafield.findAll(this.props.resource, this.props.id)
        .then((metafields) =>  this.setState({metafields}))
    }

    get metafields() {
        let { metafields, filter } = this.state;
        if (filter == SHOW_COMPLETED) {
            return metafields.filter((field) => field.value.done)
        } else if (filter == SHOW_ACTIVE) {
            return metafields.filter((field) => field.value.done)
        }
        return metafields
    }

    get activeCount() {
        return this.metafields.filter((field) => !field.value.done).length;
    }

    addTodo(text) {
        let { id, resource } = this.props;
        Metafield.create(id, resource, {text: text})
        .then((newMetafield) => {
            let metafields = (this.state.metafields || [])
            metafields.push(newMetafield)
            this.setState({metafields});
        })
    }

    toggleAllTodos(checked) {
        Promise.all(this.metafields.map((field) => {
            field.value.done = checked;
            return field.save()
        })).then(this.fetch.bind(this))
    }

    clearCompleted() {
        Promise.all(this.metafields.map((field) => {
            if (field.value.done) {
                return field.delete()
            }
            return true
        })).then(this.fetch.bind(this))
    }

    setFilter(filter) {
        this.setState({filter});
    }

    render() {
        return (
            <section className="todoapp">
                <header className='header'>
                    <Input className="new-todo"
                            placeholder="What needs to be done?"
                            onSave={this.addTodo.bind(this)} />
                    </header>
                    <section className='main'>
                        <input className="toggle-all" type="checkbox" onChange={this.toggleAllTodos.bind(this)} checked={this.activeCount === 0} />
                        <ul className="todo-list">
                            {this.metafields.map((field) => 
                            <Todo key={field.id} field={field} refetch={this.fetch.bind(this)} />
                            )}
                        </ul>
                    </section>
                    <footer className="footer">
                        <span className="todo-count">
                            <strong>{this.activeCount}</strong>
                            </span>
                            <ul className="filters">
                                {filters.map((fltr, label) =>
                                <li>
                                    <a onClick={this.setFilter.bind(this, fltr.state)}
                                    className={classNames({selected: this.state.filter == fltr.state})}>
                                    {fltr.label}
                                    </a>
                                </li>
                                )}
                            </ul>
                    <button className="clear-completed" onClick={this.clearCompleted.bind(this)}>
                        Clear Completed
                    </button>
                    </footer>
            </section>
        );
    }
}

export default App;