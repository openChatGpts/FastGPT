import React, { useMemo } from 'react';
import { Background, ControlButton, MiniMap, Panel, useReactFlow, useViewport } from 'reactflow';
import { useContextSelector } from 'use-context-selector';
import { WorkflowContext } from '../../context';
import MyTooltip from '@fastgpt/web/components/common/MyTooltip';
import MyIcon from '@fastgpt/web/components/common/Icon';
import { Box } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import styles from './index.module.scss';
import { maxZoom, minZoom } from '../index';
import { useKeyPress } from 'ahooks';

const buttonStyle = {
  border: 'none',
  borderRadius: '6px',
  padding: '7px'
};

const FlowController = React.memo(function FlowController() {
  const { fitView, zoomIn, zoomOut } = useReactFlow();
  const { zoom } = useViewport();
  const {
    undo,
    redo,
    canRedo,
    canUndo,
    workflowControlMode,
    setWorkflowControlMode,
    mouseInCanvas
  } = useContextSelector(WorkflowContext, (v) => v);
  const { t } = useTranslation();

  const isMac = !window ? false : window.navigator.userAgent.toLocaleLowerCase().includes('mac');

  // Controller shortcut key
  useKeyPress(['ctrl.z', 'meta.z'], (e) => {
    if (!mouseInCanvas) return;
    undo();
  });
  useKeyPress(['ctrl.shift.z', 'meta.shift.z', 'ctrl.y', 'meta.y'], (e) => {
    if (!mouseInCanvas) return;
    redo();
  });
  useKeyPress(['ctrl.add', 'meta.add', 'ctrl.equalsign', 'meta.equalsign'], (e) => {
    e.preventDefault();
    if (!mouseInCanvas) return;
    zoomIn();
  });
  useKeyPress(['ctrl.dash', 'meta.dash'], (e) => {
    e.preventDefault();
    if (!mouseInCanvas) return;
    zoomOut();
  });

  const Render = useMemo(() => {
    return (
      <>
        <MiniMap
          style={{
            height: 92,
            width: 150,
            marginBottom: 62,
            borderRadius: '10px',
            boxShadow: '0px 0px 1px rgba(19, 51, 107, 0.10), 0px 4px 10px rgba(19, 51, 107, 0.10)'
          }}
          pannable
        />
        <Panel
          position={'bottom-right'}
          style={{
            display: 'flex',
            marginBottom: 16,
            padding: '5px 8px',
            background: 'white',
            borderRadius: '6px',
            overflow: 'hidden',
            alignItems: 'center',
            gap: '2px',
            boxShadow:
              '0px 0px 1px 0px rgba(19, 51, 107, 0.20), 0px 12px 16px -4px rgba(19, 51, 107, 0.20)'
          }}
        >
          {/* Control Mode */}
          <MyTooltip
            label={
              workflowControlMode === 'select'
                ? t('workflow:pan_priority')
                : t('workflow:mouse_priority')
            }
          >
            <ControlButton
              onClick={() => {
                setWorkflowControlMode(workflowControlMode === 'select' ? 'drag' : 'select');
              }}
              style={{
                ...buttonStyle
              }}
              className={`${styles.customControlButton}`}
            >
              <MyIcon
                name={
                  workflowControlMode === 'select'
                    ? 'core/workflow/touchTable'
                    : 'core/workflow/mouse'
                }
              />
            </ControlButton>
          </MyTooltip>

          <Box w="1px" h="20px" bg="gray.200" mx={1.5}></Box>

          {/* undo */}
          <MyTooltip label={isMac ? t('common:common.undo_tip_mac') : t('common:common.undo_tip')}>
            <ControlButton
              onClick={undo}
              style={buttonStyle}
              className={`${styles.customControlButton}`}
              disabled={!canUndo}
            >
              <MyIcon name={'core/workflow/undo'} />
            </ControlButton>
          </MyTooltip>

          {/* redo */}
          <MyTooltip label={isMac ? t('common:common.redo_tip_mac') : t('common:common.redo_tip')}>
            <ControlButton
              onClick={redo}
              style={buttonStyle}
              className={`${styles.customControlButton}`}
              disabled={!canRedo}
            >
              <MyIcon name={'core/workflow/redo'} />
            </ControlButton>
          </MyTooltip>

          <Box w="1px" h="20px" bg="gray.200" mx={1.5}></Box>

          {/* zoom out */}
          <MyTooltip
            label={isMac ? t('common:common.zoomin_tip_mac') : t('common:common.zoomin_tip')}
          >
            <ControlButton
              onClick={() => zoomOut()}
              style={buttonStyle}
              className={`${styles.customControlButton}`}
              disabled={zoom <= minZoom}
            >
              <MyIcon name={'common/subtract'} />
            </ControlButton>
          </MyTooltip>

          {/* zoom in */}
          <MyTooltip
            label={isMac ? t('common:common.zoomout_tip_mac') : t('common:common.zoomout_tip')}
          >
            <ControlButton
              onClick={() => zoomIn()}
              style={buttonStyle}
              className={`${styles.customControlButton}`}
              disabled={zoom >= maxZoom}
            >
              <MyIcon name={'common/addLight'} />
            </ControlButton>
          </MyTooltip>

          <Box w="1px" h="20px" bg="gray.200" mx={1.5}></Box>

          {/* fit view */}
          <MyTooltip label={t('common:common.page_center')}>
            <ControlButton
              onClick={() => fitView()}
              style={buttonStyle}
              className={`custom-workflow-fix_view ${styles.customControlButton}`}
            >
              <MyIcon name={'core/modules/fixview'} />
            </ControlButton>
          </MyTooltip>
        </Panel>
        <Background />
      </>
    );
  }, [
    workflowControlMode,
    isMac,
    t,
    undo,
    canUndo,
    redo,
    canRedo,
    zoom,
    setWorkflowControlMode,
    zoomOut,
    zoomIn,
    fitView
  ]);

  return Render;
});

export default FlowController;