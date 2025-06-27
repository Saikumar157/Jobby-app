import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {AiOutlineSearch} from 'react-icons/ai'
import Cookies from 'js-cookie'
import JobCardItem from '../JobCardItem'
import Header from '../Header'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const locationsList = [
  {
    label: 'Hyderabad',
    locationId: 'HYDERABAD',
  },
  {
    label: 'Bangalore',
    locationId: 'BANGALORE',
  },
  {
    label: 'Chennai',
    locationId: 'CHENNAI',
  },
  {
    label: 'Delhi',
    locationId: 'DELHI',
  },
  {
    label: 'Mumbai',
    locationId: 'MUMBAI',
  },
]

const jobsApiStatusConstant = {
  intial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const profileApiStatusConstant = {
  intial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    jobsApiStatus: jobsApiStatusConstant.intial,
    profileApiStatus: profileApiStatusConstant.intial,
    profileData: {},
    jobsData: [],
    activeCheckBoxList: [],
    activeSalaryRangeId: '',
    searchInput: '',
    activeLocationList: [],
  }

  componentDidMount() {
    this.getProfileData()
    this.getJobsData()
  }

  getProfileData = async () => {
    this.setState({profileApiStatus: profileApiStatusConstant.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/profile`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedProfileData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileData: updatedProfileData,
        profileApiStatus: profileApiStatusConstant.success,
      })
    } else {
      this.setState({profileApiStatus: profileApiStatusConstant.failure})
    }
  }

  getJobsData = async () => {
    this.setState({jobsApiStatus: jobsApiStatusConstant.inProgress})
    const {
      activeCheckBoxList,
      activeSalaryRangeId,
      searchInput,
      activeLocationList,
    } = this.state
    const type = activeCheckBoxList.join(',')

    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${type}&minimum_package=${activeSalaryRangeId}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const filteredByLocation =
        activeLocationList.length === 0
          ? data.jobs
          : data.jobs.filter(job =>
              activeLocationList.includes(job.location.toUpperCase()),
            )
      const filteredJobsList = filteredByLocation.map(eachJob => ({
        id: eachJob.id,
        companyLogoUrl: eachJob.company_logo_url,
        title: eachJob.title,
        packagePerAnnum: eachJob.package_per_annum,
        jobDescription: eachJob.job_description,
        employmentType: eachJob.employment_type,
        rating: eachJob.rating,
        location: eachJob.location,
      }))
      this.setState({
        jobsData: filteredJobsList,
        jobsApiStatus: jobsApiStatusConstant.success,
      })
    } else {
      this.setState({jobsApiStatus: jobsApiStatusConstant.failure})
    }
  }

  onRetryjobs = () => {
    this.getJobsData()
  }

  renderFailureJobsView = () => (
    <>
      <div className="failure-img-button-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
          className="failure-img"
        />
        <h1 className="failure-heading">Oops! Something Went Wrong</h1>
        <p className="failure-description">
          We cannot seem to find the page you are looking for
        </p>
        <div className="failure-button-container">
          <button
            type="button"
            className="failure-btn"
            onClick={this.onRetryjobs}
          >
            Retry
          </button>
        </div>
      </div>
    </>
  )

  renderSuccessJobsView = () => {
    const {jobsData} = this.state
    const noOfJobs = jobsData.length > 0

    return noOfJobs ? (
      <ul className="job-items-container">
        {jobsData.map(each => (
          <JobCardItem key={each.id} item={each} />
        ))}
      </ul>
    ) : (
      <div className="no-jobs-container">
        <img
          className="no-jobs-img"
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs. Try other filters.</p>
      </div>
    )
  }

  renderLoadingJobsView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobs = () => {
    const {jobsApiStatus} = this.state
    switch (jobsApiStatus) {
      case jobsApiStatusConstant.inProgress:
        return this.renderLoadingJobsView()
      case jobsApiStatusConstant.success:
        return this.renderSuccessJobsView()
      case jobsApiStatusConstant.failure:
        return this.renderFailureJobsView()
      default:
        return null
    }
  }

  onClickLocation = event => {
    const {activeLocationList} = this.state
    if (activeLocationList.includes(event.target.id)) {
      const updatedLocation = activeLocationList.filter(
        each => each !== event.target.id,
      )
      this.setState({activeLocationList: updatedLocation}, this.getJobsData)
    } else {
      this.setState(
        prevState => ({
          activeLocationList: [
            ...prevState.activeLocationList,
            event.target.id,
          ],
        }),
        this.getJobsData,
      )
    }
  }

  getLocationsView = () => (
    <ul className="check-boxes-container">
      {locationsList.map(eachItem => (
        <li className="li-container" key={eachItem.locationId}>
          <input
            className="input-element"
            id={eachItem.locationId}
            type="checkbox"
            onChange={this.onClickLocation}
          />
          <label className="label-element" htmlFor={eachItem.locationId}>
            {eachItem.label}
          </label>
        </li>
      ))}
    </ul>
  )

  onSelectSalaryRange = event => {
    this.setState({activeSalaryRangeId: event.target.id}, this.getJobsData)
  }

  getRadioButtonsView = () => (
    <ul className="radio-button-container">
      {salaryRangesList.map(eachItem => (
        <li className="li-container" key={eachItem.salaryRangeId}>
          <input
            className="radio"
            id={eachItem.salaryRangeId}
            type="radio"
            name="option"
            onChange={this.onSelectSalaryRange}
          />
          <label className="label-element" htmlFor={eachItem.salaryRangeId}>
            {eachItem.label}
          </label>
        </li>
      ))}
    </ul>
  )

  onClickCheckbox = event => {
    const {activeCheckBoxList} = this.state
    if (activeCheckBoxList.includes(event.target.id)) {
      const updatedList = activeCheckBoxList.filter(
        each => each !== event.target.id,
      )
      this.setState({activeCheckBoxList: updatedList}, this.getJobsData) // Added 'this.getJobsData' callback
    } else {
      this.setState(
        prevState => ({
          activeCheckBoxList: [
            ...prevState.activeCheckBoxList,
            event.target.id,
          ],
        }),
        this.getJobsData,
      )
    }
  }

  getCheckBoxesView = () => (
    <ul className="check-boxes-container">
      {employmentTypesList.map(eachItem => (
        <li className="li-container" key={eachItem.employmentTypeId}>
          <input
            className="input-element"
            id={eachItem.employmentTypeId}
            type="checkbox"
            onChange={this.onClickCheckbox}
          />
          <label className="label-element" htmlFor={eachItem.employmentTypeId}>
            {eachItem.label}
          </label>
        </li>
      ))}
    </ul>
  )

  onRetryProfile = () => {
    this.getProfileData()
  }

  renderFailureView = () => (
    <div>
      <button type="button" onClick={this.onRetryProfile}>
        Retry
      </button>
    </div>
  )

  renderProfileView = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData
    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="profile-img" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-description">{shortBio}</p>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfile = () => {
    const {profileApiStatus} = this.state
    switch (profileApiStatus) {
      case profileApiStatusConstant.inProgress:
        return this.renderLoadingView()
      case profileApiStatusConstant.success:
        return this.renderProfileView()
      case profileApiStatusConstant.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSubmitSearchInput = () => {
    this.getJobsData()
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobsData()
    }
  }

  renderSearchContainer = () => {
    const {searchInput} = this.state

    return (
      <>
        <input
          className="search-input"
          type="search"
          value={searchInput}
          placeholder="Search"
          onChange={this.onChangeSearchInput}
          onKeyDown={this.onEnterSearchInput}
        />
        <button
          className="search-button"
          type="button"
          data-testid="searchButton"
          onClick={this.onSubmitSearchInput}
          aria-label="Search"
        >
          <AiOutlineSearch className="search-icon" />
        </button>
      </>
    )
  }

  render() {
    return (
      <>
        <Header />
        <div className="body-container">
          <div className="sm-search-container">
            {this.renderSearchContainer()}
          </div>
          <div className="side-filters-container">
            {this.renderProfile()}
            <hr className="hr-line" />
            <h1 className="employ-details-heading">Type of Employment</h1>
            {this.getCheckBoxesView()}
            <hr className="hr-line" />
            <h1 className="salary-details-heading">Salary Range</h1>
            {this.getRadioButtonsView()}
            <hr className="hr-line" />
            <h1 className="salary-details-heading">Location</h1>
            {this.getLocationsView()}
          </div>
          <div className="jobs-lists-container">
            <div className="lg-search-container">
              {this.renderSearchContainer()}
            </div>
            {this.renderJobs()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
