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
        <ul className="eventlist">{eventItemList}</ul>
    );
}

export default EventList;