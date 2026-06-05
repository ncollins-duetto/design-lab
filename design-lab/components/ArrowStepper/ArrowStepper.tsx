import React, { FC, useCallback } from 'react';
import { useMediaQuery, Box, useTheme } from '@material-ui/core';
import clsx from 'clsx';
import useStyles from './ArrowStepperStyles';
import SingleStep from './SingleStep/SingleStep';
import { StepConfig, StepperModes, StepState } from './types/ArrowStepperTypes';

export interface ArrowStepperProps {
  steps: StepConfig[];
  currentStepId?: string;
  mode?: StepperModes;
  showStepDescription?: boolean;
  wrapText?: boolean;
  onStepClick?: (stepId: string) => void;
}

/**
 * Computes the step state based on the current step and ordering.
 *
 * Returns "active" for the current step, "completed" for any step before it,
 * and "inactive" otherwise.
 */
const getComputedStepState = (
  step: StepConfig,
  index: number,
  currentStepId: string | undefined,
  currentStepIndex: number,
  activeStepIndex: number
): StepState => {
  if (step.id === currentStepId) {
    return StepState.ACTIVE;
  }

  if (currentStepIndex !== -1 && index < activeStepIndex) {
    return StepState.COMPLETED;
  }

  return StepState.INACTIVE;
};

const ArrowStepper: FC<ArrowStepperProps> = ({
  steps,
  currentStepId,
  mode = StepperModes.READONLY,
  showStepDescription = true,
  wrapText = false,
  onStepClick,
}: ArrowStepperProps) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Handle step click
  const handleStepClick = useCallback(
    (stepId: string) => {
      if (mode === StepperModes.READONLY) {
        return;
      }
      onStepClick?.(stepId);
    },
    [mode, onStepClick]
  );

  if (!steps || steps.length === 0) {
    return null;
  }

  const currentStepIndex = steps.findIndex((step) => step.id === currentStepId);
  const displayStepIndex = currentStepIndex === -1 ? 0 : currentStepIndex;

  return (
    <Box
      className={clsx(
        isMobile ? classes.mobileStepperContainer : classes.stepperContainer
      )}
      data-test={isMobile ? 'arrow-stepper-mobile' : 'arrow-stepper'}
      role="navigation"
      aria-label="Progress steps"
    >
      <div
        className={
          isMobile ? classes.mobileStepperContent : classes.stepperContent
        }
      >
        {steps.map((step: StepConfig, index: number) => {
          const isInteractive = mode === StepperModes.INTERACTIVE;
          const computedState = getComputedStepState(
            step,
            index,
            currentStepId,
            currentStepIndex,
            displayStepIndex
          );
          const stepState: StepState = step.state ?? computedState;
          const isClickable = isInteractive && stepState !== StepState.DISABLED;

          return (
            <SingleStep
              key={step.id}
              step={step}
              index={index}
              isMobile={isMobile}
              stepState={stepState}
              isClickable={isClickable}
              showStepDescription={showStepDescription}
              wrapText={wrapText}
              onStepClick={handleStepClick}
            />
          );
        })}
      </div>
    </Box>
  );
};

export default ArrowStepper;
