import {withRouter, Link} from 'react-router-dom'
import {AiFillHome} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav-container">
      <div>
        <Link className="nav-link" to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-img"
          />
        </Link>
        <ul className="list-container">
          <li className="nav-links-container">
            <Link className="nav-link" to="/">
              <h1 className="nav-item">Home</h1>
            </Link>
            <Link to="/" className="nav-link-sm">
              <AiFillHome className="nav-icon" />
            </Link>
          </li>
          <li>
            <Link className="nav-link" to="/jobs">
              <h1 className="nav-item">Jobs</h1>
            </Link>
            <Link to="/jobs" className="nav-link-sm">
              <BsFillBriefcaseFill className="nav-icon" />
            </Link>
          </li>
          <li className="logout-btn-list-item-small">
            <button
              type="button"
              className="logout-button-sm"
              onClick={onClickLogout}
              aria-label="Logout"
            >
              <FiLogOut className="nav-icon" />
            </button>
            <button
              className="logout-btn"
              type="button"
              onClick={onClickLogout}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default withRouter(Header)
