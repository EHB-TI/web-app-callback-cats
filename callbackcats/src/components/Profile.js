import { useHistory } from "react-router-dom";
import { Tab, Tabs, Accordion } from "react-bootstrap";

const Profile = props => {
    const history = useHistory();

    return (
        <div className="App">

            {props.user && props.user.type === "normal" &&
                <div className="App">
                    <div style={{ margin: '0 auto', padding: '2.5em' }}>
                        <h1 style={{ float: 'left' }}>Profile</h1>
                    </div>

                    <br></br>

                    <Tabs style={{ margin: '0 auto', padding: '2.5em' }} defaultActiveKey="profile" id="uncontrolled-tab-example" className="mb-3">
                        <Tab eventKey="orders" title="Orders">
                            <Accordion style={{ margin: '0 auto', padding: '2.5em' }} defaultActiveKey="0">
                                {props.user.orders.map(order => {
                                    let prods = []
                                    let totalPrice = 0;
                                    for(const p of order.order) {
                                        prods.push(p.product.name);
                                        totalPrice += p.quantity * (p.product.price/1000);
                                    }
                                    
                                    return (
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header>Order #{props.user.orders.indexOf(order) + 1}</Accordion.Header>
                                            <Accordion.Body>
                                                Products: {prods.join(', ')}
                                                <br />
                                                Total price: &euro; {totalPrice.toFixed(2)}
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    )
                                })}
                            </Accordion>
                        </Tab>
                    </Tabs>

                </div>
            }

            {
                !props.user && history.push("/")
            }

        </div>
    );

}

export default Profile;