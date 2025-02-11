 'use client';

export function Instructions() {
  return (
    <div className="space-y-4 text-gray-600">
      <h1 className="text-center text-4xl font-bold text-gray-900">
        Wheel of Life Assessment Tool
      </h1>
      <p className="text-gray-600 mx-auto">
        This simple but powerful Wheel of Life assessment tool will enable you to improve your overall life faster so you can live a happier more fulfilled life.
      </p>
      <p>The Wheel of Life assessment tool will help:</p>
      <ul className="list-disc list-outside space-y-2 ml-6">
        <li>
          Give you a visual representation of your life satisfaction so you can clearly see how your life looks currently.
        </li>
        <li>
          Assess your life in the 10 areas so you can identify and focus on improving the areas that you value, enabling you to improve your life faster.
        </li>
        <li>
          Set SMART Goals and Actions so you know what you need to do and why, which means you will be motivated to stick to your goals.
        </li>
        <li>
          Develop better habits that are aligned with the person you want to become and live the life you desire.
        </li>
      </ul>
      <p>
        Begin by ranking your level of happiness between 0 – 10 in each category, use the? to help guide you.
      </p>
      <p>
        For reference{' '}
        <strong>
          (0 = Unhappy, 3 = Needs Improvement, 5 = Can improve, 7 = Happy, 10 = Very Happy)
        </strong>
      </p>
    </div>
  );
}