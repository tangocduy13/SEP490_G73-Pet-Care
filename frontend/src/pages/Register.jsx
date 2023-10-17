import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import {
    MDBContainer,
    MDBCol,
    MDBRow,
    MDBBtn,
    MDBIcon,
    MDBInput,
    MDBCheckbox
}
    from 'mdb-react-ui-kit';

export const Register = () => {
    const navigate = useNavigate()
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
    })

    const registerUser = async (e) => {
        e.preventDefault();
        const { name, email, password } = data
        try {
            const { data } = await axios.post('/register', {
                name, email, password
            })
            if (data.error) {
                toast.error(data.error)
            } else {
                setData({})
                toast.success("Register successful. Welcome!")
                navigate('/login')
            }
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <MDBContainer fluid className="p-3 my-5">

            <MDBRow>

                <MDBCol col='10' md='6'>
                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg" className="img-fluid" alt="Phone image" />
                </MDBCol>

                <MDBCol col='4' md='6'>
                    <MDBInput wrapperClass='mb-4' label='Full name' id='formControlLg' type='text' value={data.name} size="lg" onChange={(e) => setData({ ...data, name: e.target.value })} />
                    <MDBInput wrapperClass='mb-4' label='Email address' id='formControlLg' type='email' value={data.email} size="lg" onChange={(e) => setData({ ...data, email: e.target.value })} />
                    <MDBInput wrapperClass='mb-4' label='Password' id='formControlLg' type='password' value={data.password} size="lg" onChange={(e) => setData({ ...data, password: e.target.value })} />


                    <div className="d-flex justify-content-between mx-4 mb-4">
                        <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
                        <a href="!#">Forgot password?</a>
                    </div>

                    <MDBBtn className="mb-4 w-100" size="lg" onClick={registerUser}>Sign in</MDBBtn>

                    <div className="divider d-flex align-items-center my-4">
                        <p className="text-center fw-bold mx-3 mb-0">OR</p>
                    </div>

                    <MDBBtn className="mb-4 w-100" size="lg" style={{ backgroundColor: '#3b5998' }}>
                        <MDBIcon fab icon="facebook-f" className="mx-2" />
                        Continue with facebook
                    </MDBBtn>

                    <MDBBtn className="mb-4 w-100" size="lg" style={{ backgroundColor: '#55acee' }}>
                        <MDBIcon fab icon="twitter" className="mx-2" />
                        Continue with twitter
                    </MDBBtn>

                </MDBCol>

            </MDBRow>

        </MDBContainer>
        // <div>
        //     <form onSubmit={registerUser}>
        //         <label>Name</label>
        //         <input type='text' placeholder='enter name...' value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
        //         <label>Email</label>
        //         <input type='email' placeholder='enter email...' value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
        //         <label>Password</label>
        //         <input type='password' placeholder='enter password...' value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} />
        //         <button type='submit'>Register</button>
        //     </form>
        // </div>
    )
}
