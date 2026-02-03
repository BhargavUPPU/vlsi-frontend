"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";
import Marquee from "react-fast-marquee";
import { ExternalLink } from "lucide-react";

export default function RunningNotifications() {
  // Fetch running notifications from API
  const { data: notifications } = useQuery({
    queryKey: ["running-notifications"],
    queryFn: () => apiClient.get(API_ENDPOINTS.RUNNING_NOTIFICATIONS.BASE),
  });

  const notificationList = Array.isArray(notifications?.data)
    ? notifications.data
    : [];

  return (
    <div className="bg-linear-to-r from-red-600 via-red-500 to-orange-500 text-white border-y border-orange-600">
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Latest Updates Label */}
        <div className="shrink-0 bg-blue-700 px-3 sm:px-4 py-2 sm:py-3 md:py-4 font-semibold text-xs sm:text-sm">
          Latest Updates
        </div>

        {/* Marquee Container */}
        <div className="flex-1 overflow-hidden">
          {notificationList.length === 0 ? (
            <Marquee gradient={false} speed={40}>
              <div className="py-2 px-6 sm:px-8">
                <span className="text-white text-xs sm:text-sm font-medium">
                  No notifications at the moment
                </span>
              </div>
            </Marquee>
          ) : (
            <Marquee
              gradient={false}
              speed={40}
              pauseOnHover={true}
              className="py-2"
            >
              {notificationList.map((notification, index) => (
                <div key={notification.id} className="inline-flex items-center">
                  {notification.link ? (
                    <a
                      href={notification.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-blue-200 hover:underline transition-colors inline-flex items-center gap-1 sm:gap-2 px-4 sm:px-6 md:px-8"
                    >
                      <span className="text-xs sm:text-sm font-medium">
                        {notification.message}
                      </span>
                      <ExternalLink size={12} className="flex-shrink-0 sm:w-3.5 sm:h-3.5" />
                    </a>
                  ) : (
                    <span className="text-white text-xs sm:text-sm font-medium px-4 sm:px-6 md:px-8">
                      {notification.message}
                    </span>
                  )}

                  {/* Separator */}
                  {index < notificationList.length - 1 && (
                    <span className="text-white mx-2 sm:mx-4">•</span>
                  )}
                </div>
              ))}
            </Marquee>
          )}
        </div>
      </div>
    </div>
  );
}
