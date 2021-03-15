import EventItem from './EventItem/EventItem';

const EventList = props => {
    const eventItemList = props.events.map(event => {
        return <EventItem
                    event={event}
                    key={event._id}
                    showDetail={props.showDetail}
                    />
    });

    return (
        eventItemList.length === 0 ? <h2>No Events</h2> : <ul className="eventlist">{eventItemList}</ul>
    );
}

export default EventList;