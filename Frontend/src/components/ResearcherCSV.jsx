import React, { Component } from 'react';
import { CSVLink } from "react-csv";

const headers = [
  { label: "vaccination", key: "vaccination" },
  { label: "gender", key: "gender" },
  { label: "yearofbirth", key: "yearofbirth" },
  { label: "postal", key: "postal" },
];

class ResearcherCSV extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
    this.csvLinkEl = React.createRef();
  }

  downloadReport = async () => {
    const res = await fetch("http://172.25.76.159:4000/researcher/research");
    const data = await res.json();
    this.setState({ data: data }, () => {
      setTimeout(() => {
        this.csvLinkEl.current.link.click();
      });
    });
  }

  render() {
    const { data } = this.state;

    return (
      <div>
        <input type="button" value="Research Data" onClick={this.downloadReport} />
        <CSVLink
          headers={headers}
          filename="data.csv"
          data={data}
          ref={this.csvLinkEl}
        />
      </div>
    );
  }
}

export default ResearcherCSV;