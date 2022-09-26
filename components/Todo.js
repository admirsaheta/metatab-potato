import React, { PropTypes, Component } from 'react'
import classNames from 'classnames'
import Input from './Input'

class Todo extends Component {
    constructor(props) {
        super(props);
        this.state = { isEditing: false }
    }

    toggleDone(e) {
        let { field } = this.props;
        field.value.done = !field.value.done;
        field.save().then(this.props.refetch);
    }

    removeTodo() {
        this.toggleEditing(false)
        this.props.field.delete().then(this.props.refetch);
    }

    toggleEditing(isEditing) {
        this.setState({ isEditing })
    }

    renameTodo(newText) {
        this.toggleEditing(false)
        let { field } = this.props;
        field.value.text = newText;
        field.save().then(this.props.refetch);
    }

    render() {
        let { field } = this.props;
        return (
            <li className={classNames({completed: field.value.done, editing: this.state.isEditing})}>
                <div className='view'>
                    <input
                    checked = {field.value.done}
                    className='toggle'
                    onChange={this.toggleDone.bind(this)}
                    type='checkbox'
                    />
                    <label onDoubleClick={this.toggleEditing.bind(this, true)}>
                        {field.value.text}
                    </label>
                    <button className='destroy' onClick={this.removeTodo.bind(this)} />
                </div>
                {!this.state.isEditing ? null : 
                <Input classNames='edit' 
                initialValue={field.value.text}
                onCancel = {this.toggleEditing.bind(this, false)}
                onDelete = {this.removeTodo.bind(this)}
                onSave = {this.renameTodo.bind(this)}
                />
            }
            </li>
        )
    }
}

export default Todo;