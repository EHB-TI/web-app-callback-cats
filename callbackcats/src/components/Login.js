import { Button, FloatingLabel, Form } from "react-bootstrap"

const Login = _ => {
    return(
        <div>
            <div className="login">
                <div style={{width:'fit-content', margin:'0 auto', padding:'2.5em'}} className="mx-auto">
                    <h1>Log in</h1>
                    <br></br>
                    
                    <Form method="post">
                        {/* Email */}
                        <FloatingLabel controlId="floatingInput" label="Email address" className="mb-3">
                            <Form.Control type="email" placeholder="name@example.com" />
                        </FloatingLabel>

                        {/* Password */}
                        <FloatingLabel controlId="floatingPassword" label="Password" className="mb-1">
                            <Form.Control type="password" placeholder="Password" />
                        </FloatingLabel>

                        <br></br>
                        {/* Remember me */}
                        <Form.Check inline label="Remember me" type="checkbox" id="rememberMe" />

                        <div className="d-grid mt-4 gap-1">
                            {/* Submit */}
                            <Button type="submit" variant="primary" className="py-2">
                                Login
                            </Button>
                            
                            {/* Register */}
                            {/* >> To different page or different post route */}
                            <Button variant="outline-dark" href="register">
                                Sign up
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default Login;