import React from "react"
import {
    ListItem,
    ListItemIcon,
    Checkbox,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
} from "@material-ui/core"

import DeleteIcon from "@material-ui/icons/Delete"

import { gql, useMutation, useQuery } from "@apollo/client"

const DELETE_TODO = gql`
  mutation deleteTodo($id: String!) {
    deleteTodo(id: $id)
  }
`
const UPDATE_TODO = gql`
  mutation updateTodo($id: String!, $done: Boolean!) {
    updateTodo(id: $id, done: $done)
  }
`

const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      title
      done
    }
  }
`

const Todo = ({ todo }) => {
    const [deleteTodo] = useMutation(DELETE_TODO)
    const [updateTodo] = useMutation(UPDATE_TODO)
    const { refetch } = useQuery(GET_TODOS)
    const [checked, setChecked] = React.useState(todo.done)

    const updateTodoFunc = (id, done) => {
        updateTodo({
            variables: { id: id, done: done },
            refetchQueries: [{ query: GET_TODOS }]

        })
        refetch()

    }

    return (
        <ListItem key={todo.id} role={undefined} dense button onClick={() => { }}>
            <ListItemIcon>
                <Checkbox
                    color='secondary'
                    edge="start"
                    checked={checked}
                    onChange={() => {
                        setChecked(!checked)
                        updateTodoFunc(todo.id, todo.done)
                    }}
                    tabIndex={-1}
                    disableRipple
                />
            </ListItemIcon>
            <ListItemText id={todo.id} primary={`${todo.title}`} />
            <ListItemSecondaryAction>
                <IconButton
                    edge="end"
                    aria-label="comments"
                    onClick={() => {
                        deleteTodo({
                            variables: { id: todo.id },
                            refetchQueries: [{ query: GET_TODOS }]
                        })

                    }}
                >
                    <DeleteIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    )
}

export default Todo
