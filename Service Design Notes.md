# Menus

## List of WeeklyMenu items

Query the WeeklyMenus collection by `weekNumber` field, within range of today's date and 6 weeks ago.

## List of favorite meals

Get list of `favoriteMealIds` from `user`, and fetch those from `meals` collection.

# My Plan

## List of meals under this week's plan

Calculate this week's mealNumber by date, and fetch from `weeklyPlans` collection by `userId` and `weekNumber`.
- Get list of `user.favoriteMealIds`, and interpolate the `isFavorite` field on meal objects.

For previous weeks, search by incremented `weekNumber`.

## Shopping list

