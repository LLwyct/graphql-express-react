import React from 'react'
import AuthContext from '../../context/auth-context';


const EventList = props => {
    if (props.events.length === 0) {
        return <h1 style={{ textAlign: "center" }}>Empty</h1>
    }
    const eventItemList = props.events.map(event => {
        return <EventItem
            event={event}
            key={event._id}
            showDetail={props.showDetail}
        />
    });
    return (
        <table className="table">
            <thead>
                <tr>
                    <th scope="col">title</th>
                    <th scope="col">price</th>
                    <th scope="col">date</th>
                    <th scope="col">creator</th>
                </tr>
            </thead>
            <tbody>
                {eventItemList}
            </tbody>
        </table>
    );
}

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

export default EventList;