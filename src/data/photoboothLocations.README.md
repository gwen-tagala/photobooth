# Editing photobooth locations

Add one branch per row in `photoboothLocations.csv`. Keep the header row and column names as shown:

```csv
id,vendor,country,branchName,address,latitude,longitude,operatingDates,pricing,website,instagram,notes
vendor-branch-01,Vendor Name,Japan,Shibuya Branch,"1-2-3 Shibuya, Tokyo",35.6595,139.7005,February 5-12 2027,"From ¥500",https://vendor.example,https://instagram.com/vendor,
```

Required columns: `id`, `vendor`, `country`, `branchName`, `latitude`, and `longitude`. Leave optional values blank when unknown. IDs should be unique. Wrap any value containing a comma, quote, or line break in double quotes; represent a quote inside a quoted value as `""`.

The country and vendor values are independent. Use the same vendor on branches in different countries as needed. The current sample rows are marked as test data in their `notes` field; replace them with confirmed locations before publishing.
