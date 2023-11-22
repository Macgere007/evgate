# SOLARAPP SaaS Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## First Deploy

- Run `sls deploy --region ap-southeast-1 --stage dev` to sync the build dist to S3.
- Run `sls syncToS3 --region ap-southeast-1 --stage dev` to sync the build dist to S3.
- Run `sls invalidateCloudFrontCache --region ap-southeast-1 --stage dev` to invalidate CloudFront’s cache to make sure new files are served.

## Next Deploy

- Run `ng build` to rebuild the project for development and update the `dist/` directory.
- Run `ng build --configuration production --aot` to rebuild the project for proudction and update the `dist/' directory.
- Run `sls syncToS3 --region ap-southeast-1 --stage dev` to sync the build dist to S3.
- Run `sls invalidateCloudFrontCache --region ap-southeast-1 --stage dev` to invalidate CloudFront’s cache to make sure new files are served.
- Or use `aws s3 sync dist/fuse/ s3://evgate.energie.co.id --delete --profile hei`
- aws cloudfront create-invalidation --distribution-id E2G1A4FLMLLXUO --paths "/*" --profile feiryorg

## Deployment Note

- `evgate basic` has stage name `evgate`. it has bucket name `evgate.energie.co.id`, and url `evgate.energie.co.id` (dev)
- `evgate pro` has stage name `evgatepro`. it has bucket name `evgatepro.energie.co.id`, and url `evgate-pro.stroomer.co.id` (dev)
- `evgate cp` has stage name `evgatecp`. it has bucket name `evgatecp.energie.co.id`, and url `cp-evgate.stroomer.co.id` (prod)
- `evgate hyundai` has stage name `evgatehyundai`. it has bucket name `evgatehyundai.energie.co.id`, and url `hyundai-evgate.stroomer.co.id` (prod)

## To view Cloud Front domain info

- Run `sls domainInfo --stage dev --region ap-southeast-1` to figure out the deployed URL.

## Running unit tests

- Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice.  To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Coding help

### Add navigation menu & languages

- Add the navigation menu in app/mock-api/common/navigation/data.ts
- Add the translation in app/layout/common/languages/languages.component.ts
