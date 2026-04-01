import React from 'react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="space-y-4 text-sm text-gray-700">
      <h4 className="font-semibold text-base text-gray-800">Privacy Policy</h4>

      <div className="space-y-2">
        <p className="font-medium text-gray-900">What the app stores</p>
        <p>
          The app stores local gameplay session data on your device, such as session duration,
          total rolls, selected random mode, roll distribution, undo count, auto-roll status, and
          seven counts by player.
        </p>
      </div>

      <div className="space-y-2">
        <p className="font-medium text-gray-900">Why this data is used</p>
        <p>
          This data is used to show session history, improve balancing, and support statistics
          features inside the app.
        </p>
      </div>

      <div className="space-y-2">
        <p className="font-medium text-gray-900">Server-side analytics</p>
        <p>
          Session statistics may be sent to a server for anonymous analytics. The app can generate
          an anonymous local user ID so multiple sessions from the same installation can be grouped
          together without requiring sign-in.
        </p>
      </div>

      <div className="space-y-2">
        <p className="font-medium text-gray-900">Local control</p>
        <p>
          You can clear locally stored session history at any time from the History popup using the
          Clear button.
        </p>
      </div>

      <div className="space-y-2">
        <p className="font-medium text-gray-900">Future changes</p>
        <p>
          If account features or online sync are added later, this policy should be updated to
          describe those changes more precisely.
        </p>
      </div>
    </div>
  );
};
