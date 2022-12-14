import { isNull } from 'lodash'

const Notification = ({ message, isError }) => {
  if (isNull(message)) return;

  const color = isError === true ? 'red' : 'green'

  const style = {
    fontSize: 25,
    color,
    borderRadius: 5,
    border: `solid ${color} 2px`,
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

export default Notification
