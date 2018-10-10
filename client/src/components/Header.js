import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router';
import { AUTH_TOKEN } from '../constants';

class Header extends Component {
    render(){
        const authToken = localStorage.getItem(AUTH_TOKEN);
        return (
            <div className='navbar navbar-expand-sm navbar-dark bg-dark mb-4'>
                <div className='container'>
                    <div className='navbar-brand'> Resource Links for Fullstack </div>
                <ul className='navbar-nav ml-auto' >
                    <li className='nav-item'>
                        <Link to='/' className='nav-link' >news</Link>
                    </li>
                    <li className='nav-item'>
                        <Link to='/top' className='nav-link' >top</Link>
                    </li>
                    {authToken && (
                    <li className='nav-item'>
                        <Link to='/create' className='nav-link'>Submit</Link>
                    </li>
                    )
                    }
                    <li className='nav-item'>
                        <Link to='/search' className='nav-link' >Search</Link>
                    </li>
                <li className='nav-item'>
                    {authToken ? (
                        <div className='btn btn-info mr-1'
                            onClick={()=>{
                                localStorage.removeItem(AUTH_TOKEN);
                                this.props.history.push('/');
                            }}
                        >
                           Logout
                        </div>
                    ) : (
                        <Link to='/login' className='btn btn-info mr-1'>Login</Link>
                    )
                    }
                </li>
                </ul>
                </div>
            </div>
        );
    }
}

export default withRouter(Header);