import { ButtonBase, Typography } from '@material-ui/core';
import clsx from 'clsx';
import React, { FC } from 'react';
import useStyles from '../ArrowStepperStyles';
import { StepConfig, StepState } from '../types/ArrowStepperTypes';

export interface SingleStepProps {
  step: StepConfig;
  index: number;
  isMobile: boolean;
  stepState: StepState;
  isClickable: boolean;
  showStepDescription: boolean;
  wrapText?: boolean;
  onStepClick: (stepId: string) => void;
}

/**
 * Renders a single step within the ArrowStepper component.
 *
 * Displays as a button which reflects active, completed, or disabled state,
 * and handles click interactions to trigger step changes.
 *
 * @param {SingleStepProps} props - The properties for configuring the step.
 * @param {StepConfig} props.step - The configuration object for this step.
 * @param {number} props.index - The zero-based index of this step.
 * @param {boolean} props.isMobile - Whether to render in mobile mode.
 * @param {StepState} props.stepState - Current state for this step.
 * @param {boolean} props.isClickable - Whether the step is interactive.
 * @param {boolean} props.showStepDescription - Whether the step description should be shown.
 * @param {(stepId: string) => void} props.onStepClick - Callback when step is clicked.
 *
 * @author natalia-leal
 */
const SingleStep: FC<SingleStepProps> = ({
  step,
  index,
  isMobile,
  stepState,
  isClickable,
  showStepDescription,
  wrapText = false,
  onStepClick,
}) => {
  const classes = useStyles();
  const isActive = stepState === StepState.ACTIVE;

  return (
    <ButtonBase
      className={clsx(classes.stepButton, {
        [classes.stepActiveState]: stepState === StepState.ACTIVE,
        [classes.stepCompletedState]: stepState === StepState.COMPLETED,
        [classes.stepButtonInactive]: stepState === StepState.INACTIVE,
        [classes.stepDisabledState]: stepState === StepState.DISABLED,
      })}
      onClick={() => isClickable && onStepClick(step.id)}
      disabled={!isClickable}
      data-test={isMobile ? `mobile-step-${step.id}` : `step-${step.id}`}
      data-state={stepState}
      aria-current={isActive ? 'step' : undefined}
      aria-disabled={!isClickable}
    >
      {isMobile ? (
        // Mobile: Show numbers only
        index + 1
      ) : (
        // Desktop: Show full content
        <div className={classes.stepContent}>
          <Typography
            variant="body2"
            className={clsx(classes.stepTitle, {
              [classes.stepTitleWrap]: wrapText,
            })}
          >
            {step.label}
          </Typography>
          {showStepDescription && step.description && (
            <Typography
              variant="caption"
              className={clsx(classes.stepDescription, {
                [classes.stepDescriptionWrap]: wrapText,
              })}
            >
              {step.description}
            </Typography>
          )}
        </div>
      )}
    </ButtonBase>
  );
};

export default SingleStep;
