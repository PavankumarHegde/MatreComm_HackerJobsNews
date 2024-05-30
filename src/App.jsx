import React, { useState, useEffect } from "react";
import "./styles.css";

const JobBoard = () => {
  const [jobIds, setJobIds] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchJobIds();
  }, []);

  const fetchJobIds = async () => {
    try {
      const response = await fetch(
        "https://hacker-news.firebaseio.com/v0/jobstories.json"
      );
      const data = await response.json();
      setJobIds(data.slice(0, 6)); // Load the initial 6 job IDs
    } catch (error) {
      console.error("Error fetching job IDs:", error);
    }
  };

  useEffect(() => {
    if (jobIds.length === 0) return;

    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const promises = jobIds.map(async (id) => {
          const response = await fetch(
            `https://hacker-news.firebaseio.com/v0/item/${id}.json`
          );
          const data = await response.json();
          return data;
        });
        const jobData = await Promise.all(promises);
        setJobs(jobData);
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [jobIds]);

  const loadMoreJobs = () => {
    const nextPage = jobIds.length + 6;
    setJobIds((prevIds) =>
      prevIds.concat(jobIds.slice(nextPage, nextPage + 6))
    );
  };

  return (
    <div className="container">
      <h1 className="heading">Hacker News Jobs Board:</h1>
      {jobs.map((job) => (
        <div key={job.id} className="job-container">
          <div className="job-details">
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="job-title"
            >
              <strong>{job.title}</strong>
            </a>
            <div className="publisher">
              <span>by {job.by}</span>
            </div>
            <div className="date">
              <span className="job-meta">
                {new Date(job.time * 1000).toLocaleString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </span>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={loadMoreJobs}
        disabled={isLoading}
        className="load-button"
      >
        {isLoading ? "Loading..." : "Load more"}
      </button>
    </div>
  );
};

export default JobBoard;
