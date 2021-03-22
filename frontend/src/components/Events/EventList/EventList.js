import EventItem from './EventItem/EventItem';

const EventList = props => {
    if (props.events.length === 0) {
        return <h1 style={{textAlign: "center"}}>Empty</h1>
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

export default EventList;