/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ElementalThemeConfig } from '@/types';
import { getElementalTheme } from '@/data/elementalThemes';

export interface JointPos {
  x: number;
  y: number;
}

export interface AvatarJoints {
  head: JointPos;
  neck: JointPos;
  leftShoulder: JointPos;
  rightShoulder: JointPos;
  leftElbow: JointPos;
  rightElbow: JointPos;
  leftWrist: JointPos;
  rightWrist: JointPos;
  leftHip: JointPos;
  rightHip: JointPos;
  leftKnee: JointPos;
  rightKnee: JointPos;
  leftAnkle: JointPos;
  rightAnkle: JointPos;
}

export interface FlowZenAvatarProps {
  joints: AvatarJoints;
  elementalTheme?: ElementalThemeConfig;
  activeView?: 'front' | 'side' | 'top';
  isCurrentlyInhaling?: boolean;
  showSkeletonOverlay?: boolean;
  movementPhase?: 'preparation' | 'transition' | 'extension' | 'recovery';
}

export const FlowZenAvatar: React.FC<FlowZenAvatarProps> = ({
  joints,
  elementalTheme,
  activeView = 'front',
  isCurrentlyInhaling = false,
  showSkeletonOverlay = false,
  movementPhase = 'extension',
}) => {
  const theme = elementalTheme || getElementalTheme('air');
  const primaryColor = theme.visuals.primaryColor;
  const secondaryColor = theme.visuals.secondaryColor;
  const accentColor = theme.visuals.accentColor;
  const glowColor = theme.visuals.glowColor;

  // Dantian center (Center of gravity near lower abdomen)
  const dantianX = (joints.leftHip.x + joints.rightHip.x) / 2;
  const dantianY = (joints.leftHip.y + joints.rightHip.y) / 2 - 1.5;

  // Calculate midpoint for spine base
  const hipCenterY = (joints.leftHip.y + joints.rightHip.y) / 2;

  // Hand extensions (approximate palm position from wrist)
  const leftHandX = joints.leftWrist.x + (joints.leftWrist.x - joints.leftElbow.x) * 0.25;
  const leftHandY = joints.leftWrist.y + (joints.leftWrist.y - joints.leftElbow.y) * 0.25;
  const rightHandX = joints.rightWrist.x + (joints.rightWrist.x - joints.rightElbow.x) * 0.25;
  const rightHandY = joints.rightWrist.y + (joints.rightWrist.y - joints.rightElbow.y) * 0.25;

  // Foot stance pads (approximate feet direction from ankles)
  const leftFootX = joints.leftAnkle.x - 2.5;
  const leftFootY = joints.leftAnkle.y + 1.2;
  const rightFootX = joints.rightAnkle.x + 2.5;
  const rightFootY = joints.rightAnkle.y + 1.2;

  // Torso tunic robe path
  const tunicPath = `
    M ${joints.neck.x} ${joints.neck.y}
    L ${joints.leftShoulder.x} ${joints.leftShoulder.y}
    Q ${joints.leftShoulder.x - 1.5} ${(joints.leftShoulder.y + joints.leftHip.y) / 2}, ${joints.leftHip.x - 2} ${joints.leftHip.y + 4}
    L ${joints.rightHip.x + 2} ${joints.rightHip.y + 4}
    Q ${joints.rightShoulder.x + 1.5} ${(joints.rightShoulder.y + joints.rightHip.y) / 2}, ${joints.rightShoulder.x} ${joints.rightShoulder.y}
    Z
  `;

  return (
    <g className="flowzen-avatar-group">
      <defs>
        {/* Elemental Radial Glow */}
        <radialGradient id="dantian-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={primaryColor} stopOpacity="0.8" />
          <stop offset="50%" stopColor={secondaryColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
        </radialGradient>

        <radialGradient id="aura-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={glowColor} stopOpacity="0.6" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>

        {/* Limb Linear Gradients */}
        <linearGradient id="left-arm-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor={primaryColor} />
        </linearGradient>

        <linearGradient id="right-arm-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor={secondaryColor} />
        </linearGradient>
      </defs>

      {/* 1. Grounding / Elemental Aura Circle */}
      <circle
        cx={dantianX}
        cy={dantianY}
        r={isCurrentlyInhaling ? "22" : "18"}
        fill="url(#aura-glow)"
        className="transition-all duration-1000 ease-in-out"
      />

      {/* Ground Stance Shadow */}
      <ellipse
        cx={dantianX}
        cy={Math.max(joints.leftAnkle.y, joints.rightAnkle.y) + 2}
        rx="22"
        ry="4"
        fill="#000000"
        opacity="0.3"
      />

      {/* 2. Flowing Trousers / Legs (Thick Tai Chi Stance) */}
      {/* Left Leg (Thigh & Calf) */}
      <path
        d={`M ${joints.leftHip.x} ${joints.leftHip.y} L ${joints.leftKnee.x} ${joints.leftKnee.y} L ${joints.leftAnkle.x} ${joints.leftAnkle.y}`}
        fill="none"
        stroke="#1c1917"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={`M ${joints.leftHip.x} ${joints.leftHip.y} L ${joints.leftKnee.x} ${joints.leftKnee.y} L ${joints.leftAnkle.x} ${joints.leftAnkle.y}`}
        fill="none"
        stroke="#374151"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Right Leg (Thigh & Calf) */}
      <path
        d={`M ${joints.rightHip.x} ${joints.rightHip.y} L ${joints.rightKnee.x} ${joints.rightKnee.y} L ${joints.rightAnkle.x} ${joints.rightAnkle.y}`}
        fill="none"
        stroke="#1c1917"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={`M ${joints.rightHip.x} ${joints.rightHip.y} L ${joints.rightKnee.x} ${joints.rightKnee.y} L ${joints.rightAnkle.x} ${joints.rightAnkle.y}`}
        fill="none"
        stroke="#4b5563"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Feet / Slippers */}
      <ellipse
        cx={leftFootX}
        cy={leftFootY}
        rx="3"
        ry="1.8"
        fill="#111827"
        stroke="#374151"
        strokeWidth="0.8"
      />
      <ellipse
        cx={rightFootX}
        cy={rightFootY}
        rx="3"
        ry="1.8"
        fill="#111827"
        stroke="#374151"
        strokeWidth="0.8"
      />

      {/* Foot Grounding Pressure Indicators */}
      <ellipse
        cx={leftFootX}
        cy={leftFootY + 1.2}
        rx="4.5"
        ry="1.5"
        fill="none"
        stroke={primaryColor}
        strokeWidth="0.6"
        opacity="0.7"
      />
      <ellipse
        cx={rightFootX}
        cy={rightFootY + 1.2}
        rx="4.5"
        ry="1.5"
        fill="none"
        stroke={secondaryColor}
        strokeWidth="0.6"
        opacity="0.7"
      />

      {/* 3. Tai Chi Robe / Torso Tunic */}
      <path
        d={tunicPath}
        fill="#1f2937"
        stroke="#374151"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* Belt / Sash at Waist */}
      <line
        x1={joints.leftHip.x - 1.5}
        y1={hipCenterY}
        x2={joints.rightHip.x + 1.5}
        y2={hipCenterY}
        stroke={primaryColor}
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Spine Realignment Indicator */}
      <line
        x1={joints.neck.x}
        y1={joints.neck.y}
        x2={dantianX}
        y2={dantianY}
        stroke={accentColor}
        strokeWidth="1"
        strokeDasharray="1.5 1.5"
        opacity="0.6"
      />

      {/* Fabric Wave & Sleeve Movement Paths */}
      {/* Left Arm Fabric Sleeve (Upper Arm to Forearm to Wrist) */}
      <path
        d={`M ${joints.leftShoulder.x} ${joints.leftShoulder.y} Q ${(joints.leftShoulder.x + joints.leftElbow.x)/2 - 1} ${(joints.leftShoulder.y + joints.leftElbow.y)/2 + 1}, ${joints.leftElbow.x} ${joints.leftElbow.y} Q ${(joints.leftElbow.x + joints.leftWrist.x)/2 - 0.8} ${(joints.leftElbow.y + joints.leftWrist.y)/2 + 0.8}, ${joints.leftWrist.x} ${joints.leftWrist.y}`}
        fill="none"
        stroke={primaryColor}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.95"
      />

      {/* Right Arm Fabric Sleeve */}
      <path
        d={`M ${joints.rightShoulder.x} ${joints.rightShoulder.y} Q ${(joints.rightShoulder.x + joints.rightElbow.x)/2 + 1} ${(joints.rightShoulder.y + joints.rightElbow.y)/2 + 1}, ${joints.rightElbow.x} ${joints.rightElbow.y} Q ${(joints.rightElbow.x + joints.rightWrist.x)/2 + 0.8} ${(joints.rightElbow.y + joints.rightWrist.y)/2 + 0.8}, ${joints.rightWrist.x} ${joints.rightWrist.y}`}
        fill="none"
        stroke={secondaryColor}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.95"
      />

      {/* Elemental Energy System Trails */}
      {theme.id === 'air' && (
        <g className="elemental-air-ribbons">
          <path
            d={`M ${leftHandX - 4} ${leftHandY - 2} Q ${leftHandX} ${leftHandY - 6}, ${leftHandX + 4} ${leftHandY - 2}`}
            fill="none"
            stroke="#bae6fd"
            strokeWidth="0.8"
            strokeDasharray="2,2"
            className="animate-pulse"
          />
          <path
            d={`M ${rightHandX - 4} ${rightHandY - 2} Q ${rightHandX} ${rightHandY - 6}, ${rightHandX + 4} ${rightHandY - 2}`}
            fill="none"
            stroke="#e0f2fe"
            strokeWidth="0.8"
            strokeDasharray="2,2"
            className="animate-pulse"
          />
        </g>
      )}

      {theme.id === 'fire' && (
        <g className="elemental-fire-embers">
          <circle cx={leftHandX} cy={leftHandY - 2} r="2.2" fill="#f97316" opacity="0.8" className="animate-ping" style={{ animationDuration: '2s' }} />
          <circle cx={rightHandX} cy={rightHandY - 2} r="2.2" fill="#fb923c" opacity="0.8" className="animate-ping" style={{ animationDuration: '2.5s' }} />
        </g>
      )}

      {theme.id === 'water' && (
        <g className="elemental-water-ripples">
          <circle cx={leftHandX} cy={leftHandY} r="5" fill="none" stroke="#38bdf8" strokeWidth="0.6" opacity="0.6" />
          <circle cx={rightHandX} cy={rightHandY} r="5" fill="none" stroke="#0284c7" strokeWidth="0.6" opacity="0.6" />
        </g>
      )}

      {theme.id === 'earth' && (
        <g className="elemental-earth-grounding">
          <ellipse cx={dantianX} cy={Math.max(joints.leftAnkle.y, joints.rightAnkle.y) + 2.5} rx="16" ry="3.5" fill="none" stroke="#a3e635" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.8" />
        </g>
      )}

      {/* Soft Palms / Hands */}
      <circle
        cx={leftHandX}
        cy={leftHandY}
        r="1.8"
        fill="#fde68a"
        stroke="#d97706"
        strokeWidth="0.6"
      />
      <circle
        cx={rightHandX}
        cy={rightHandY}
        r="1.8"
        fill="#fde68a"
        stroke="#d97706"
        strokeWidth="0.6"
      />

      {/* Hand Energy Flow Trails */}
      <circle
        cx={leftHandX}
        cy={leftHandY}
        r="3.5"
        fill="none"
        stroke={primaryColor}
        strokeWidth="0.5"
        opacity="0.6"
      />
      <circle
        cx={rightHandX}
        cy={rightHandY}
        r="3.5"
        fill="none"
        stroke={secondaryColor}
        strokeWidth="0.5"
        opacity="0.6"
      />

      {/* 5. Head, Neck & Topknot */}
      {/* Neck */}
      <line
        x1={joints.head.x}
        y1={joints.head.y + 2.5}
        x2={joints.neck.x}
        y2={joints.neck.y}
        stroke="#e5e7eb"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Head Silhouette */}
      <circle
        cx={joints.head.x}
        cy={joints.head.y}
        r="4.2"
        fill="#fef3c7"
        stroke="#d97706"
        strokeWidth="1"
      />

      {/* Topknot / Hair Bun */}
      <circle
        cx={joints.head.x}
        cy={joints.head.y - 4.2}
        r="1.6"
        fill="#1f2937"
      />

      {/* 6. Dantian Energy Center (Pulsing Center of Mass) */}
      <circle
        cx={dantianX}
        cy={dantianY}
        r={isCurrentlyInhaling ? "3.2" : "2.2"}
        fill={primaryColor}
        className="transition-all duration-700 ease-in-out"
      >
        <title>Dantian Energy Center</title>
      </circle>
      <circle
        cx={dantianX}
        cy={dantianY}
        r="1.2"
        fill="#ffffff"
      />

      {/* 7. Optional Biomechanical Skeleton Overlay */}
      {showSkeletonOverlay && (
        <g opacity="0.85">
          {/* Bone lines */}
          <line x1={joints.neck.x} y1={joints.neck.y} x2={joints.leftShoulder.x} y2={joints.leftShoulder.y} stroke="#38bdf8" strokeWidth="1" />
          <line x1={joints.neck.x} y1={joints.neck.y} x2={joints.rightShoulder.x} y2={joints.rightShoulder.y} stroke="#fb923c" strokeWidth="1" />
          <line x1={joints.leftShoulder.x} y1={joints.leftShoulder.y} x2={joints.leftHip.x} y2={joints.leftHip.y} stroke="#38bdf8" strokeWidth="1" />
          <line x1={joints.rightShoulder.x} y1={joints.rightShoulder.y} x2={joints.rightHip.x} y2={joints.rightHip.y} stroke="#fb923c" strokeWidth="1" />
          <line x1={joints.leftHip.x} y1={joints.leftHip.y} x2={joints.rightHip.x} y2={joints.rightHip.y} stroke="#a855f7" strokeWidth="1" />

          {/* Joint Nodes */}
          {[joints.leftShoulder, joints.leftElbow, joints.leftWrist, joints.leftHip, joints.leftKnee, joints.leftAnkle].map((j, i) => (
            <circle key={`skel-l-${i}`} cx={j.x} cy={j.y} r="1.4" fill="#38bdf8" />
          ))}
          {[joints.rightShoulder, joints.rightElbow, joints.rightWrist, joints.rightHip, joints.rightKnee, joints.rightAnkle].map((j, i) => (
            <circle key={`skel-r-${i}`} cx={j.x} cy={j.y} r="1.4" fill="#fb923c" />
          ))}
        </g>
      )}
    </g>
  );
};
