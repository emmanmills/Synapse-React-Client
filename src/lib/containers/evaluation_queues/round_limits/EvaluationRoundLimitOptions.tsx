import { EvaluationRoundLimitType } from '../../../utils/synapseTypes/Evaluation'
import React from 'react'
import { Col, FormControl } from 'react-bootstrap'
import { EvaluationRoundLimitInput } from '../input_models/models'

export type EvaluationRoundLimitOptionsProps = {
  limitInput: EvaluationRoundLimitInput
  //all types for which an EvaluationRoundLimitOptions was already created
  allSelectedTypes: Set<EvaluationRoundLimitType>
  onChange: (limitInput: EvaluationRoundLimitInput) => void
}

export const LIMIT_TYPE_DISPLAY_NAME: Partial<Record<
  EvaluationRoundLimitType,
  string
>> = {
  // EvaluationRoundLimitType.TOTAL is purposely omitted because an <input> in the parent handles it
  DAILY: 'Daily Limit',
  WEEKLY: 'Weekly Limit',
  MONTHLY: 'Monthly Limit',
}

export const EvaluationRoundLimitOptions: React.FunctionComponent<EvaluationRoundLimitOptionsProps> = ({
  limitInput,
  allSelectedTypes,
  onChange,
}) => {
  return (
    <React.Fragment>
      <Col>
        {/*TODO: use single caret instead of double caret for custom-select*/}
        <FormControl
          as="select"
          custom
          value={limitInput.type}
          onChange={event => {
            onChange({
              type: event.target.value as EvaluationRoundLimitType,
              maxSubmissionString: limitInput.maxSubmissionString,
            })
          }}
        >
          {Object.entries(LIMIT_TYPE_DISPLAY_NAME).map(
            ([displayLimitType, displayName]) => {
              return (
                <option
                  key={displayLimitType}
                  value={displayLimitType}
                  disabled={
                    allSelectedTypes.has(
                      displayLimitType as EvaluationRoundLimitType,
                    ) && displayLimitType === limitInput.type
                  }
                >
                  {displayName}
                </option>
              )
            },
          )}
        </FormControl>
      </Col>
      <Col xs={6}>
        <input
          type="text"
          pattern="[0-9]*"
          value={limitInput.maxSubmissionString}
          style={{ width: '100%' }}
          onChange={event => {
            onChange({
              type: limitInput.type,
              maxSubmissionString: event.target.value,
            })
          }}
        />
      </Col>
    </React.Fragment>
  )
}
