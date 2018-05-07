# Menus

## List of WeeklyMenu items

Query the WeeklyMenus collection by `weekNumber` field, within range of today's date and 6 weeks ago.

## List of favorite meals

Get list of `favoriteMealIds` from `user`, and fetch those from `meals` collection.

# My Plan

## List of meals under this week's plan

Calculate this week's `weeklNumber` by date, and fetch from `weeklyPlans` collection by `userId` and `weekNumber`.
- If no `weeklyPlan` exists for user, or if `mealIds` is empty, show a button to allow user to "Add all meals from this week's menu."
- Get list of `user.favoriteMealIds`, and interpolate the `isFavorite` field on meal objects.

For previous weeks, search by incremented `weekNumber`.

## List of this week's prep instructions

Extract the `prepInstructions` from each meal under the week's plan.

## Shopping list



