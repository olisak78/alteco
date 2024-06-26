'use client';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-base-table/styles.css';
import '../forms.css';
import Form from 'react-bootstrap/Form';
import { FilterType, Status } from '../types';
import { SetStateAction } from 'react';
import { useAtom } from 'jotai';
import { atomFilterText, atomFilterType } from '../atoms';

export default function TableFilter() {
  const [currentFilterType, setCurrentFilterType] = useAtom(atomFilterType); // state for filter type
  const [currentFilterText, setCurrentFilterText] = useAtom(atomFilterText); // state for filter input text

  const handleSelectChange = (e: {
    // function for handling filter type change
    target: { value: SetStateAction<string> };
  }) => {
    setCurrentFilterType(e.target.value);
    setCurrentFilterText('');
  };
  const handleFilterTextChange = (e: {
    // function for handling filter text change
    target: { value: SetStateAction<string> };
  }) => {
    setCurrentFilterText(e.target.value);
  };

  return (
    <div className='filtercontainer'>
      <div className='filterselector'>
        <Form.Select onChange={handleSelectChange}>
          <option>Filter by</option>
          {Object.keys(FilterType).map(
            (fil) =>
              isNaN(+fil) && (
                <option key={fil} value={fil}>
                  {fil}
                </option>
              )
          )}
        </Form.Select>
      </div>
      <div className='filtertext'>
        {currentFilterType === 'Status' ? (
          <Form.Select onChange={handleFilterTextChange}>
            <option>Select Status</option>
            {Object.keys(Status).map(
              (st) =>
                isNaN(+st) && (
                  <option key={st} value={st}>
                    {st}
                  </option>
                )
            )}
          </Form.Select>
        ) : (
          <Form.Control
            type='text'
            disabled={
              currentFilterType !== 'Email' && currentFilterType !== 'Name'
            }
            onChange={handleFilterTextChange}
            value={currentFilterText}
            placeholder={
              currentFilterType === 'Name'
                ? 'Enter name'
                : currentFilterType === 'Email'
                ? 'Enter email'
                : ''
            }
          />
        )}
      </div>
    </div>
  );
}
