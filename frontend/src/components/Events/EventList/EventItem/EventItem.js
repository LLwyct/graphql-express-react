import React from 'react';
import './EventItem.css';
import AuthContext from '../../../../context/auth-context';

const EventItem = props => {
    const ctx = React.useContext(AuthContext);
    return (
        <tr>
            <th scope="row">{props.event.title}</th>
            <td>{props.event.price}</td>
            <td>{new Date(props.event.date).toLocaleString()}</td>
            <td>{
                ctx.userId === props.event.creator._id ?
                "you are the creator."
                : <div>
                    <button onClick={() => props.showDetail(props.event._id)} className="btn btn-primary">MORE DETAIL</button>
                </div>
                }</td>
        </tr>
    );
}
export default EventItem;