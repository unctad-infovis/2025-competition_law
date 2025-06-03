import React, { useState, useEffect } from 'react';
import '../styles/styles.less';

import { v4 as uuidv4 } from 'uuid';

// Load helpers.
// import formatNr from './helpers/FormatNr.js';
// import roundNr from './helpers/RoundNr.js';
import parseCSV from './helpers/CsvToJson.js';
import DwChartContainer from './components/DwChartContainer.jsx';

// const appID = '#app-root-2025-competition_law';

function App() {
  // Data states.
  const [data, setData] = useState(false);
  const [checked, setChecked] = useState([true, true, true, true, false]);
  const [countrySearch, setCountrySearch] = useState('');

  useEffect(() => {
    const data_file = (window.location.href.includes('unctad.org')) ? 'data.csv' : './assets/data/data.csv';
    try {
      fetch(data_file)
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response.text();
        })
        .then(body => setData(parseCSV(body)));
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
  }, [data]);

  const changeStatus = (i) => {
    const tmp_checked = [...checked];
    tmp_checked[i] = !tmp_checked[i];
    setChecked(tmp_checked);
  };

  const changeCountry = (event) => {
    setCountrySearch(event.target.value);
  };

  return (
    <div className="app">
      {
        data
          && (
          <>
            <div className="charts_container">
              <h3>Countries with a competition law</h3>
              <DwChartContainer chart_id="MEBOF" />
            </div>
            <div className="controls_container">
              <div className="control_container">
                <span className="label">Filter by country</span>
                {' '}
                <input type="text" onChange={(event) => changeCountry(event)} placeholder="start type a name of a country…" />
              </div>
              <div className="control_container">
                <span className="label">Filter by category</span>
                {
                  Object.keys(data[0]).splice(1).map((row, i) => (
                    <div key={uuidv4()}>
                      <label htmlFor={row}>
                        <input type="checkbox" id={row} checked={checked[i + 1]} onChange={(() => changeStatus(i + 1))} />
                        {row}
                      </label>
                    </div>
                  ))
                }
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  {
                  Object.keys(data[0]).map((row, i) => {
                    if (checked[i] === true) {
                      return (<th key={uuidv4()}>{row}</th>);
                    }
                    return false;
                  })
                }
                </tr>
              </thead>
              <tbody>
                {data
                  .filter(row => String(row[Object.keys(data[0])[0]])
                    .toLowerCase()
                    .includes(countrySearch.toLowerCase()))
                  .map((row) => (
                    <tr key={uuidv4()}>
                      {Object.keys(data[0]).map((header, i) => (checked[i] ? (
                        <td key={uuidv4()}>
                          {String(row[header])
                            .split('\\')
                            .map((part, idx, arr) => (
                              <React.Fragment key={uuidv4()}>
                                {part}
                                {idx < arr.length - 1 && <br />}
                              </React.Fragment>
                            ))}
                        </td>
                      ) : null))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </>
          )
      }
    </div>
  );
}

export default App;
