import './Modal.css';

const Modal = props => (
    <div className="mymodal shadow p-5">
        <header>
            <h1>{props.title}</h1>
        </header>
        <section className="modal__content">
            {props.children}
        </section>
        <section className="modal__action">
            <button onClick={props.onCancel} className="btn btn-light">Cancel</button>
            <button onClick={props.onConfirm} className="btn btn-primary" style={{marginLeft: "1rem"}}>{props.secondBtnText}</button>
        </section>
    </div>
);

export default Modal;