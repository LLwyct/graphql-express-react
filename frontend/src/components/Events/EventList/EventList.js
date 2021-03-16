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
        <ul className="eventlist">{eventItemList}</ul>
    );
}

export default EventList;