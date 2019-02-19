/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <LocalAuthentication/LocalAuthentication.h>

@implementation AppDelegate

- (void)application:(UIApplication *)application performActionForShortcutItem:(UIApplicationShortcutItem *)shortcutItem completionHandler:(void (^)(BOOL))completionHandler
{
  if ([shortcutItem.type isEqualToString:@"DO_YOU"]) {
    UIStoryboard *braveStory = [UIStoryboard storyboardWithName:@"Brave" bundle:nil];
    UITabBarController *tabbarVC = [braveStory instantiateViewControllerWithIdentifier:@"Brave"];
    
    [self.window.rootViewController presentViewController:tabbarVC animated:YES completion:nil];
  } else if ([shortcutItem.type isEqualToString:@"IM_SURE"]) {
    LAContext *context = [[LAContext alloc] init];
    NSError *authError = nil;
    NSString *myLocalizedReasonString = @"老子要用你的面容，嗯哼";
    
    if ([context canEvaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics error:&authError]) {
      [context evaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics
                localizedReason:myLocalizedReasonString
                          reply:^(BOOL success, NSError *error) {
                            if (success) {
                              // successful
                              UIStoryboard *braveStory = [UIStoryboard storyboardWithName:@"Secret" bundle:nil];
                              UITabBarController *tabbarVC = [braveStory instantiateViewControllerWithIdentifier:@"Secret"];
                              
                              [self.window.rootViewController presentViewController:tabbarVC animated:YES completion:nil];
                            } else {
                              // fail
                              exit(0);
                            }
                          }];
    } else {
      // no you can't
      exit(0);
    }
  }
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;
//  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"bundle/index.ios" withExtension:@"jsbundle"];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"nativeClient"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [UIColor blackColor];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

@end
