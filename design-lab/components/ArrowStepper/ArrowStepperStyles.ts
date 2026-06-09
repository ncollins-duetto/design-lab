import { makeStyles } from '@material-ui/core';
import { color2026 } from '@duetto/duetto-components';

const FIRST_STEP_CLIPPATH_DESKTOP =
  'polygon(0% 0%, calc(100% - 20px) 0%, 100% 50%, calc(100% - 20px) 100%, 0% 100%)';
const FIRST_STEP_CLIPPATH_MOBILE =
  'polygon(0% 0%, calc(100% - 12px) 0%, 100% 50%, calc(100% - 12px) 100%, 0% 100%)';
const MIDDLE_STEP_CLIPPATH_DESKTOP =
  'polygon(0% 0%, calc(100% - 20px) 0%, 100% 50%, calc(100% - 20px) 100%, 0% 100%, 20px 50%)';
const MIDDLE_STEP_CLIPPATH_MOBILE =
  'polygon(0% 0%, calc(100% - 12px) 0%, 100% 50%, calc(100% - 12px) 100%, 0% 100%, 12px 50%)';
const LAST_STEP_CLIPPATH_DESKTOP =
  'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 20px 50%)';
const LAST_STEP_CLIPPATH_MOBILE =
  'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 12px 50%)';

const useStyles = makeStyles((theme) => ({
  mobileStepperContainer: {
    display: 'none',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing(2),
      backgroundColor: 'transparent',
    },
  },
  stepperContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2, 0),
    backgroundColor: 'transparent',
    width: '100%',
    overflow: 'visible',
    [theme.breakpoints.down('sm')]: {
      display: 'none', // Hide on mobile
    },
  },
  mobileStepperContent: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    gap: theme.spacing(0.5),
    width: '100%',
  },
  stepperContent: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    gap: theme.spacing(0.5),
    height: '3.5rem',
  },
  stepButton: {
    position: 'relative',
    background: theme.palette.common.white,
    color: theme.palette.text?.secondary ?? color2026.text.secondary,
    border: 'none',
    borderRadius: 0,
    flex: 1,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontFamily: theme.typography.fontFamily,
    zIndex: theme.zIndex.appBar - 1,
    margin: 0,

    // Desktop sizing
    padding: theme.spacing(1.5, 3),
    minWidth: '9.375rem',
    maxWidth: 'none',
    height: '4rem',
    fontSize: '1rem',
    flexDirection: 'column',

    // Mobile sizing
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1, 1.5),
      minWidth: '5rem',
      height: '2.5rem',
      fontSize: '0.875rem',
      flexDirection: 'row',
    },

    // Pseudo-element for border that respects clip-path
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      background: theme.palette.grey?.[300] ?? color2026.grey[300],
      zIndex: -1,
      borderRadius: 0,
    },

    // First step - straight left edge, arrow pointing right
    '&:first-child': {
      // Desktop clip-path and padding
      clipPath: FIRST_STEP_CLIPPATH_DESKTOP,
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(5.5),
      marginRight: theme.spacing(-2),
      borderRadius: '8px 0 0 8px',

      // Mobile overrides
      [theme.breakpoints.down('sm')]: {
        clipPath: FIRST_STEP_CLIPPATH_MOBILE,
        paddingLeft: theme.spacing(1.5), // 12px inner padding
        paddingRight: theme.spacing(2.5), // 12px (arrow) + 12px (inner padding) + 4px extra = 28px total
        marginRight: '-8px',
        borderRadius: '4px 0 0 4px', // Only round the left side
      },

      '&::before': {
        clipPath: FIRST_STEP_CLIPPATH_DESKTOP,
        borderRadius: '8px 0 0 8px', // Only round the left side

        [theme.breakpoints.down('sm')]: {
          clipPath: FIRST_STEP_CLIPPATH_MOBILE,
          borderRadius: '4px 0 0 4px',
        },
      },

      '&::after': {
        content: '""',
        position: 'absolute',
        top: '1px',
        left: '1px',
        right: '1px',
        bottom: '1px',
        background: 'inherit',
        clipPath: FIRST_STEP_CLIPPATH_DESKTOP,
        zIndex: -1,
        borderRadius: '8px 0 0 8px', // Only round the left side

        [theme.breakpoints.down('sm')]: {
          clipPath: FIRST_STEP_CLIPPATH_MOBILE,
          borderRadius: '4px 0 0 4px',
        },
      },
    },

    // Middle steps - left side receives arrow from previous step, right side points to next step
    '&:not(:first-child):not(:last-child)': {
      // Desktop clip-path and padding
      clipPath: MIDDLE_STEP_CLIPPATH_DESKTOP,
      paddingLeft: theme.spacing(5),
      paddingRight: theme.spacing(5.5),
      marginRight: theme.spacing(-2),

      // Mobile overrides
      [theme.breakpoints.down('sm')]: {
        clipPath: MIDDLE_STEP_CLIPPATH_MOBILE,
        paddingLeft: theme.spacing(2.5),
        paddingRight: theme.spacing(2.5),
        marginRight: theme.spacing(-1),
      },

      '&::before': {
        clipPath: MIDDLE_STEP_CLIPPATH_DESKTOP,

        [theme.breakpoints.down('sm')]: {
          clipPath: MIDDLE_STEP_CLIPPATH_MOBILE,
        },
      },

      '&::after': {
        content: '""',
        position: 'absolute',
        top: '1px',
        left: '1px',
        right: '1px',
        bottom: '1px',
        background: 'inherit',
        clipPath: MIDDLE_STEP_CLIPPATH_DESKTOP,
        zIndex: -1,

        [theme.breakpoints.down('sm')]: {
          clipPath: MIDDLE_STEP_CLIPPATH_MOBILE,
        },
      },
    },

    // Last step - left side receives arrow from previous step, right edge straight
    '&:last-child:not(:first-child)': {
      // Desktop clip-path and padding
      clipPath: LAST_STEP_CLIPPATH_DESKTOP,
      paddingLeft: theme.spacing(5),
      paddingRight: theme.spacing(3),
      borderRadius: '0 8px 8px 0',

      // Mobile overrides
      [theme.breakpoints.down('sm')]: {
        clipPath: LAST_STEP_CLIPPATH_MOBILE,
        paddingLeft: theme.spacing(2.5), // 12px (arrow) + 12px (inner padding) + 4px = 28px total
        paddingRight: theme.spacing(1.5), // 12px inner padding
        borderRadius: '0 4px 4px 0', // Only round the right side
      },

      '&::before': {
        clipPath: LAST_STEP_CLIPPATH_DESKTOP,
        borderRadius: '0 8px 8px 0', // Only round the right side

        [theme.breakpoints.down('sm')]: {
          clipPath: LAST_STEP_CLIPPATH_MOBILE,
          borderRadius: '0 4px 4px 0',
        },
      },

      '&::after': {
        content: '""',
        position: 'absolute',
        top: '1px',
        left: '1px',
        right: '1px',
        bottom: '1px',
        background: 'inherit',
        clipPath: LAST_STEP_CLIPPATH_DESKTOP,
        zIndex: -1,
        borderRadius: '0 8px 8px 0', // Only round the right side

        [theme.breakpoints.down('sm')]: {
          clipPath: LAST_STEP_CLIPPATH_MOBILE,
          borderRadius: '0 4px 4px 0',
        },
      },
    },

    // Single step (when only one step visible)
    '&:only-child': {
      clipPath: 'none',
      borderRadius: '8px', // Full border radius for single step
      padding: theme.spacing(1.5, 3),
      border: `1px solid ${theme.palette.grey?.[300] ?? color2026.grey[300]}`, // Regular border for single step

      [theme.breakpoints.down('sm')]: {
        borderRadius: '4px',
        padding: theme.spacing(1, 1.5),
      },

      '&::before': {
        display: 'none', // No pseudo-element needed for single step
      },
    },

    // Remove ripple effect on mobile
    '& .MuiTouchRipple-root': {
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },

    '&:hover': {
      zIndex: theme.zIndex.appBar,
    },

    '&:focus': {
      outline: 'none',
      '&::before': {
        background:
          theme.palette?.main?.blue?.[300] ?? color2026.main.blue[300], // Focus border color
      },
    },
  },

  // Shared state styling - works for both desktop and mobile
  stepActiveState: {
    backgroundColor: theme.palette?.main?.blue?.[50] ?? color2026.main.blue[50],
    color: theme.palette?.main?.blue?.[700] ?? color2026.main.blue[700],
    fontWeight: 600,

    '&::before': {
      background: theme.palette?.main?.blue?.[300] ?? color2026.main.blue[300], // Active border color
    },
  },

  // Shared completed step styling
  stepCompletedState: {
    backgroundColor: theme.palette.grey?.[200] ?? color2026.grey[200],
    color: theme.palette.text?.secondary ?? color2026.text.secondary,
    fontWeight: 400,

    '&::before': {
      background: theme.palette.grey?.[200] ?? color2026.grey[200], // Completed border color (same as background for subtle effect)
    },
  },

  // Shared inactive step styling
  stepButtonInactive: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.text?.secondary ?? color2026.text.secondary,

    '&::before': {
      background: theme.palette.grey?.[300] ?? color2026.grey[300],
    },
  },

  // Shared disabled step styling
  stepDisabledState: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.text.disabled,
    fontWeight: 400,
    cursor: 'default',
    opacity: 0.7,

    '&::before': {
      background: theme.palette.grey?.[300] ?? color2026.grey[300], // Disabled border color
    },
  },

  stepContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    textAlign: 'left',
    gap: theme.spacing(0.5),
    position: 'relative',
    zIndex: 1,
    width: '100%',
    padding: theme.spacing(0, 0.5),
  },

  stepTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    lineHeight: 1.2,
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
    maxWidth: 'none',
  },

  stepTitleWrap: {
    whiteSpace: 'normal',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },

  stepDescription: {
    fontSize: '0.75rem',
    fontWeight: 400,
    lineHeight: 1.2,
    margin: 0,
    opacity: 0.9,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
    maxWidth: 'none',
  },

  stepDescriptionWrap: {
    whiteSpace: 'normal',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
  },
}));

export default useStyles;
