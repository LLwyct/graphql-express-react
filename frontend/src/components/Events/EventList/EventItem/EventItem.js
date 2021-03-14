import React from 'react';
import './EventItem.css';
import AuthContext from '../../../../context/auth-context';

const EventItem = props => {
    const ctx = React.useContext(AuthContext);
    return (
        <li className="eventlist__item">
            <div>
                <h1>{props.event.title}</h1>
                <p className="text--highlight">price: {props.event.price}$ - {new Date(props.event.date).toLocaleString()}</p>
            </div>
            <div>
                {
                    ctx.userId === props.event.creator._id ?
                        <p>you are the creator.</p>
                        : <div>
                            <button onClick={props.showDetail.bind(null, props.event._id)}>MORE DETAIL</button>
                        </div>
                }
            </div>
        </li>
    );
}
export default EventItem;