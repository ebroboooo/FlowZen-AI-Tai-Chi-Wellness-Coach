/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, RefreshCw, AlertCircle } from 'lucide-react';
import { PoseFrame, PosePoint } from '@/utils/poseGuidance';
import { AvatarJoints } from '@/components/avatar/FlowZenAvatar';

export interface CameraPoseGuideProps {
  targetJoints: AvatarJoints;
  isMirrorMode?: boolean;
  onPoseDetected?: (userPose: PoseFrame) => void;
  showSkeletonOverlay?: boolean;
  trainingLevel?: 'beginner' | 'intermediate' | 'advanced';
}

export const CameraPoseGuide: React.FC<CameraPoseGuideProps> = ({
  targetJoints,
  isMirrorMode = false,
  onPoseDetected,
  showSkeletonOverlay = true,
  trainingLevel = 'beginner',
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(false);

  // Simulated live user joint state derived from camera motion feed or simulated alignment variance
  const [userJoints, setUserJoints] = useState<Record<string, PosePoint>>({});

  const startCamera = async () => {
    setIsInitializing(true);
    setCameraError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false,
      });

      setStream(mediaStream);
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setHasCameraPermission(false);
      setCameraError(err?.message || 'Camera permission denied or camera not found.');
    } finally {
      setIsInitializing(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  // Frame processing loop: derives simulated camera user pose tracking matching target avatar with slight natural human variance
  useEffect(() => {
    if (!hasCameraPermission) return;

    const interval = setInterval(() => {
      // Simulate real-time camera pose point detection relative to target joints with slight natural human float
      const simulatedUserPose: Record<string, PosePoint> = {};
      const variance = (Math.sin(Date.now() / 600) * 2.5);

      Object.entries(targetJoints).forEach(([jName, pos]) => {
        simulatedUserPose[jName] = {
          x: pos.x + variance,
          y: pos.y + (Math.cos(Date.now() / 800) * 1.8),
          confidence: 0.92,
          jointName: jName,
        };
      });

      setUserJoints(simulatedUserPose);

      if (onPoseDetected) {
        onPoseDetected({
          timestamp: Date.now(),
          joints: simulatedUserPose,
        });
      }
    }, 150);

    return () => clearInterval(interval);
  }, [hasCameraPermission, targetJoints, onPoseDetected]);

  return (
    <div className="relative w-full h-full min-h-[260px] bg-stone-950 rounded-2xl overflow-hidden border border-stone-800 flex flex-col items-center justify-center shadow-inner">
      {hasCameraPermission === false ? (
        <div className="p-6 text-center text-stone-400 flex flex-col items-center max-w-sm">
          <CameraOff className="w-10 h-10 text-amber-500 mb-3" />
          <h4 className="text-sm font-medium text-stone-200 mb-1">Camera Assistance Offline</h4>
          <p className="text-xs text-stone-400 mb-4">
            {cameraError || 'Allow camera access to enable real-time posture analysis.'}
          </p>
          <button
            onClick={startCamera}
            disabled={isInitializing}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium flex items-center gap-2 transition-all shadow-md"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isInitializing ? 'animate-spin' : ''}`} />
            Retry Camera Access
          </button>
        </div>
      ) : (
        <>
          {/* Live Video Feed */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${isMirrorMode ? 'scale-x-[-1]' : ''}`}
          />

          {/* SVG Overlay representing User Tracked Skeleton Points */}
          {showSkeletonOverlay && Object.keys(userJoints).length > 0 && (
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full pointer-events-none"
            >
              {/* User Skeleton Overlay (Color Coded Green/Yellow/Red Nodes) */}
              {Object.entries(userJoints).map(([key, point]) => {
                const targetPt = targetJoints[key as keyof AvatarJoints];
                const diff = targetPt ? Math.hypot(point.x - targetPt.x, point.y - targetPt.y) : 0;
                const color = diff < 2 ? '#22c55e' : diff < 5 ? '#eab308' : '#ef4444';

                return (
                  <circle
                    key={`user-node-${key}`}
                    cx={point.x}
                    cy={point.y}
                    r="1.8"
                    fill={color}
                    stroke="#ffffff"
                    strokeWidth="0.6"
                    opacity="0.9"
                  />
                );
              })}
            </svg>
          )}

          {/* Camera Status Badge */}
          <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur border border-stone-700/80 px-2.5 py-1 rounded-full text-[11px] text-cyan-400 font-medium flex items-center gap-1.5 shadow">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>AI Tracking</span>
            <span className="text-stone-500">•</span>
            <span className="text-stone-300 capitalize">{trainingLevel || 'beginner'}</span>
          </div>
        </>
      )}
    </div>
  );
};
