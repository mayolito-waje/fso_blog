import { isNull } from 'lodash'

const ErrorMessage = ({ message }) => {
  if (isNull(message)) return;

  const style = {
    fontSize: 25,
    color: 'red',
    borderRadius: 5,
    border: `solid red 2px`,
    textAlign: 'center',
    padding: 10,
    margin: 10,
  }

  return (
    <div style={style}>
      {message}
    </div>
  )
}

export default ErrorMessage
