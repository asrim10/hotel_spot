export const API = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    WHOAMI: "/api/auth/whoami",
    UPDATEPROFILE: "/api/auth/update-profile",
    REQUEST_RESET_PASSWORD: "/api/auth/request-password-reset",
    RESET_PASSWORD: (token: string) => `/api/auth/reset-password/${token}`,
  },
  HOTELS: {
    GET_ALL: "/api/hotels/",
    GET_ONE: (hotelId: string) => `/api/hotels/${hotelId}`,
  },
  BOOKING: {
    CREATE: "/api/bookings/",
    GET_MY: "/api/bookings/me",
    GET_ONE: (bookingId: string) => `/api/bookings/${bookingId}`,
    UPDATE: (bookingId: string) => `/api/bookings/${bookingId}`,
    DELETE: (bookingId: string) => `/api/bookings/${bookingId}`,
  },
  FAVOURITE: {
    CREATE: "/api/fav/",
    GET_MY: "/api/fav/me",
    GET_ONE: (favouriteId: string) => `/api/fav/${favouriteId}`,
    DELETE: (favouriteId: string) => `/api/fav/${favouriteId}`,
  },
  REVIEW: {
    CREATE: "/api/reviews/",
    GET_MY: "/api/reviews/me",
    GET_BY_HOTEL: (hotelId: string) => `/api/reviews/hotel/${hotelId}`,
    GET_ONE: (reviewId: string) => `/api/reviews/${reviewId}`,
    UPDATE: (reviewId: string) => `/api/reviews/${reviewId}`,
    DELETE: (reviewId: string) => `/api/reviews/${reviewId}`,
  },

  ADMIN: {
    USER: {
      CREATE: "/api/admin/users/",
      GET_ALL: "/api/admin/users/",
      GET_ONE: (userId: string) => `/api/admin/users/${userId}`,
      UPDATE: (userId: string) => `/api/admin/users/${userId}`,
      DELETE: (userId: string) => `/api/admin/users/${userId}`,
    },
    HOTEL: {
      CREATE: "/api/admin/hotels/",
      GET_ALL: "/api/admin/hotels/",
      GET_ONE: (hotelId: string) => `/api/admin/hotels/${hotelId}`,
      UPDATE: (hotelId: string) => `/api/admin/hotels/${hotelId}`,
      DELETE: (hotelId: string) => `/api/admin/hotels/${hotelId}`,
    },
    BOOKING: {
      CREATE: "/api/admin/bookings/",
      GET_ALL: "/api/admin/bookings/",
      GET_ONE: (bookingId: string) => `/api/admin/bookings/${bookingId}`,
      UPDATE: (bookingId: string) => `/api/admin/bookings/${bookingId}`,
      DELETE: (bookingId: string) => `/api/admin/bookings/${bookingId}`,

      // STATUS MANAGEMENT
      UPDATE_STATUS: (bookingId: string) =>
        `/api/admin/bookings/${bookingId}/status`,
      UPDATE_PAYMENT_STATUS: (bookingId: string) =>
        `/api/admin/bookings/${bookingId}/payment-status`,

      CONFIRM: (bookingId: string) =>
        `/api/admin/bookings/${bookingId}/confirm`,
      CANCEL: (bookingId: string) => `/api/admin/bookings/${bookingId}/cancel`,
      CHECK_IN: (bookingId: string) =>
        `/api/admin/bookings/${bookingId}/check-in`,
      CHECK_OUT: (bookingId: string) =>
        `/api/admin/bookings/${bookingId}/check-out`,

      // FILTER / QUERY
      ANALYTICS_STATS: "/api/admin/bookings/analytics/stats",
      GET_BY_USER: (userId: string) => `/api/admin/bookings/user/${userId}`,
      GET_BY_STATUS: (status: string) => `/api/admin/bookings/status/${status}`,
      GET_BY_PAYMENT_STATUS: (paymentStatus: string) =>
        `/api/admin/bookings/payment-status/${paymentStatus}`,
      FILTER_DATE_RANGE: "/api/admin/bookings/filter/date-range",
      UPCOMING_CHECK_INS: "/api/admin/bookings/upcoming/check-ins",
      UPCOMING_CHECK_OUTS: "/api/admin/bookings/upcoming/check-outs",
    },
    REVIEW: {
      GET_ALL: "/api/admin/reviews/",
      GET_ONE: (reviewId: string) => `/api/admin/reviews/${reviewId}`,
      GET_BY_USER: (userId: string) => `/api/admin/reviews/user/${userId}`,
      GET_BY_HOTEL: (hotelId: string) => `/api/admin/reviews/hotel/${hotelId}`,
      UPDATE: (reviewId: string) => `/api/admin/reviews/${reviewId}`,
      DELETE: (reviewId: string) => `/api/admin/reviews/${reviewId}`,
      ANALYTICS_STATS: "/api/admin/reviews/analytics/stats",
    },
  },
};
