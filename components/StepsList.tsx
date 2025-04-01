import React from 'react';
import { CheckCircle, Circle, Clock } from 'lucide-react';
import { Step } from '../types';

interface StepsListProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
}

export function StepsList({ steps, currentStep, onStepClick }: StepsListProps) {
  return (
    <div className="bg-gray-900 rounded-xl shadow-xl p-4 h-full overflow-auto border border-gray-800 w-[300px] scrollbar-ultrathin scrollbar-thumb-gray-700/50 scrollbar-track-gray-900 hover:scrollbar-thumb-gray-600/50">
      <h2 className="text-lg font-bold mb-4 text-gray-100 flex items-center gap-2">
        <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-lg text-sm">Build Steps</span>
      </h2>
      <div className="space-y-2">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
              currentStep === step.id
                ? 'bg-gray-800/50 border-2 border-blue-500/50 shadow-lg shadow-blue-500/10'
                : 'hover:bg-gray-800/30 border border-gray-800 hover:border-gray-700'
            }`}
            onClick={() => onStepClick(step.id)}
          >
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-full ${
                step.status === 'completed' 
                  ? 'bg-green-500/10' 
                  : step.status === 'in-progress'
                  ? 'bg-blue-500/10'
                  : 'bg-gray-700/50'
              }`}>
                {step.status === 'completed' ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : step.status === 'in-progress' ? (
                  <Clock className="w-4 h-4 text-blue-400" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium text-sm truncate ${
                  currentStep === step.id ? 'text-blue-400' : 'text-gray-100'
                }`}>
                  {step.title}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed line-clamp-2">
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}