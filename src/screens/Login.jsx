import image from '../assets/image 2.png'

export function Login(){
    return(
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <div style={{flexGrow: '6', display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                <div style={{display: 'flex', flexDirection: 'column', gap: '5px', maxWidth: '500px', marginTop: '50px'}}>
                    <p style={{color: 'blue', fontSize: '24px', fontWeight: 'bold'}}>LEARNING SYSTEM</p>
                    <p style={{fontSize: '24px', fontWeight: 'bold'}}>Log in to your account</p>
                    <p>Welcome back to Learning System! Please enter your email address and password to access your account.</p>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'start', gap: '5px', marginBottom: '5px'}}>
                        <label htmlFor='username'>Email</label>
                        <input style={{padding: '7px', fontSize: '16px', width: '100%', border: 'solid 1px gray', borderRadius: '5px'}} id='username' placeholder='user@ulkit.com' />
                        <label htmlFor='username'>Password</label>
                        <input style={{padding: '7px', fontSize: '16px', width: '100%', border: 'solid 1px gray', borderRadius: '5px'}} type='password' id='password' />
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <span>
                            <input id='checkbox' type='checkbox' />
                            <span>Remember me</span>
                        </span>
                        <span>
                            Forgot your password?
                        </span>
                    </div>
                    <button style={{backgroundColor: 'blue', color: 'white'}}>Log in</button>
                    <div>Don't have an account? <a>Sign up here</a></div>
                </div>
            </div>
            <img style={{flexGrow: '1'}} src={image} alt='not found' height={800}/>

        </div>
    )
}