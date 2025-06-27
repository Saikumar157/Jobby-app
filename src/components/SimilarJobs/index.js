import {MdLocationOn} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'
import './index.css'

const SimilarJobs = props => {
  const {similarJobDetails} = props
  const {
    companyLogoUrl,
    jobDescription = 'No description available',
    employmentType,
    location,
    rating,
    title,
  } = similarJobDetails
  return (
    <li className="similar-job-li-container">
      <div className="img-title-container">
        <img
          className="company-job-logo"
          src={companyLogoUrl}
          alt="similar job company logo"
        />
        <div className="title-job-rating-container">
          <h1 className="job-heading">{title}</h1>
          <div className="star-job-rating-container">
            <AiFillStar className="star-job-icon" />
            <p className="rating-job-text">{rating}</p>
          </div>
        </div>
      </div>
      <div className="second-part-job-container">
        <h1 className="description-heading">Description</h1>
        <p className="job-description">{jobDescription}</p>
      </div>
      <div className="job-location-details-container">
        <div className="location-container">
          <MdLocationOn className="location-job-icon" />
          <p className="job-location">{location}</p>
        </div>
        <div className="employment-type-container">
          <p className="job-type">{employmentType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobs
