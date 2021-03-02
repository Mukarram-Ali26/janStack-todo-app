import React from "react"
import {
  Container,
  TextField,
  List,
  Button,
  Box,
  CircularProgress,
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import Header from "../components/Header"
import { gql, useMutation, useQuery } from "@apollo/client"
import Todo from "../components/Todo"

const ADD_TODO = gql`
  mutation AddTodo($title: String!) {
    addTodo(title: $title) {
      id
    }
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

const useStyles = makeStyles(theme => ({
  root: {
    width: "80%",
    backgroundColor: theme.palette.background.paper,
  },
  page: {
    width: "90%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  loader: {

    display: "flex",
    marginTop: "10rem",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  }
}))

export default function Home() {
  const classes = useStyles()

  const { data, loading, error, refetch } = useQuery(GET_TODOS, {
    pollInterval: 100
  })
  const [addTodo] = useMutation(ADD_TODO)


  let titleField


  const addTodoFunc = () => {

    addTodo({
      variables: { title: titleField.value },
      refetchQueries: [{ query: GET_TODOS }]
    })

    refetch()
    titleField.value = ""
  }

  return (
    <>
      <Header />
      <br />
      <br />
      <Container className={classes.page}>

        <Box>
          <TextField
            style={{ width: "100%" }}
            id="outlined-basic"
            label="Enter todo"
            variant="outlined"
            inputRef={node => titleField = node}
          />
          <br />
          <br />
          <Button

            variant="contained"
            color="secondary"
            onClick={addTodoFunc}
            fullWidth
            size="medium"
          >
            Add Todo        </Button>
        </Box>
        {loading ? <div className={classes.loader}><CircularProgress /></div> : null}
        {error ? <div>{error.message}</div> : null}

        <List className={classes.root}>
          {data?.todos.map((todo, index) => (
            <Todo todo={todo} key={index}/>
          ))}
        </List>


      </Container >
    </>
  )
}
