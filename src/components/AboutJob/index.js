import {Component} from 'react'
import Cookies from 'js-cookie'
import {MdLocationOn} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'
import {BiLinkExternal} from 'react-icons/bi'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarJobs from '../SimilarJobs'
import './index.css'

const apiStatusConstant = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class AboutJob extends Component {
  state = {
    jobDataDetails: [],
    similarJobsData: [],
    apiStatus: apiStatusConstant.initial,
  }

  componentDidMount() {
    this.getJobData()
  }

  getJobData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({apiStatus: apiStatusConstant.inProgress})
    const JwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {Authorization: `Bearer ${JwtToken}`},
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const jobDetails = fetchedData.job_details
      const updatedJobData = {
        companyLogoUrl: jobDetails.company_logo_url,
        companyWebsiteUrl: jobDetails.company_website_url,
        employmentType: jobDetails.employment_type,
        id: jobDetails.id,
        jobDescription: jobDetails.job_description,
        lifeAtCompany: {
          description: jobDetails.life_at_company.description,
          imageUrl: jobDetails.life_at_company.image_url,
        },
        location: jobDetails.location,
        packagePerAnnum: jobDetails.package_per_annum,
        rating: jobDetails.rating,
        skills: jobDetails.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),
        title: jobDetails.title,
      }

      const updatedSimilarJobData = fetchedData.similar_jobs.map(
        eachSimilarData => ({
          id: eachSimilarData.id,
          title: eachSimilarData.title,
          rating: eachSimilarData.rating,
          location: eachSimilarData.location,
          companyLogoUrl: eachSimilarData.company_logo_url,
          employmentType: eachSimilarData.employment_type,
          jobDescription: eachSimilarData.job_description,
        }),
      )

      this.setState({
        jobDataDetails: updatedJobData,
        similarJobsData: updatedSimilarJobData,
        apiStatus: apiStatusConstant.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstant.failure})
    }
  }

  onRetryJobDetailsAgain = () => {
    this.getJobData()
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>we cannot seem to find the page you are looking for</p>
      <div className="btn-container">
        <button
          className="failure-btn"
          type="button"
          onClick={this.onRetryJobDetailsAgain}
        >
          Retry
        </button>
      </div>
    </div>
  )

  renderSuccessView = () => {
    const {jobDataDetails, similarJobsData} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      id,
      jobDescription,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      skills,
      title,
    } = jobDataDetails

    return (
      <>
        <div className="job-item-container">
          <div className="first-part-container">
            <div className="img-title-container">
              <img
                src={companyLogoUrl}
                alt="job details company logo"
                className="company-logo"
              />
              <div className="title-rating-container">
                <h1 className="title-heading">{title}</h1>
                <div className="rating-container">
                  <AiFillStar className="star-icon" />
                  <p className="rating-text">{rating}</p>
                </div>
              </div>
            </div>
            <div className="location-package-container">
              <div className="location-job-type-container">
                <div className="location-icon-container">
                  <MdLocationOn className="location-icon" />
                  <p className="location">{location}</p>
                </div>
                <div className="employment-type-container">
                  <p className="job-type">{employmentType}</p>
                </div>
              </div>
              <div className="package-container">
                <p className="package">{packagePerAnnum}</p>
              </div>
            </div>
          </div>
          <hr className="hr-line" />
          <div className="second-part-container">
            <div className="description-and-visit-container">
              <h1 className="description-heading">Description</h1>
              <a className="anchor-element" href={companyWebsiteUrl}>
                Visit <BiLinkExternal />
              </a>
            </div>
            <p className="job-description">{jobDescription}</p>
          </div>
          <h1>Skills</h1>
          <ul className="jobs-details-container">
            {skills.map(eachItem => (
              <li className="job-details-container" key={eachItem.name}>
                <img
                  src={eachItem.imageUrl}
                  alt={eachItem.name}
                  className="skill-img"
                />
                <p>{eachItem.name}</p>
              </li>
            ))}
          </ul>
          <div className="company-life-img-container">
            <div className="life-heading-para-container">
              <h1>Life at Company</h1>
              <p>{lifeAtCompany.description}</p>
            </div>
            <img src={lifeAtCompany.imageUrl} alt="life at company" />
          </div>
        </div>
        <h1 className="similar-jobs-heading">Similar Jobs</h1>
        <ul className="similar-jobs-container">
          {similarJobsData.map(eachItem => (
            <SimilarJobs
              key={eachItem.id}
              similarJobDetails={eachItem}
              employmentType={employmentType}
            />
          ))}
        </ul>
      </>
    )
  }

  renderLoadingView = () => (
    <div className="job-details-loader" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderJobDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstant.inProgress:
        return this.renderLoadingView()
      case apiStatusConstant.success:
        return this.renderSuccessView()
      case apiStatusConstant.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-details-container">{this.renderJobDetails()}</div>
      </>
    )
  }
}

export default AboutJob
