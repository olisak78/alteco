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
  const [currentFilterType, setCurrentFilterType] = useAtom(atomFilterType);
  const [currentFilterText, setCurrentFilterText] = useAtom(atomFilterText);
  const handleSelectChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setCurrentFilterType(e.target.value);
    setCurrentFilterText('');
  };
  const handleFilterStatusChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setCurrentFilterText(e.target.value);
  };

  return (
    <div className='filtercontainer'>
      <div className='filterselector'>
        <Form.Select
          onChange={handleSelectChange}
          aria-label='Default select example'
        >
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
          <Form.Select onChange={handleFilterStatusChange}>
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
            onChange={handleFilterStatusChange}
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
