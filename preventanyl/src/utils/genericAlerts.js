import { Alert } from 'react-native';

const DISCLAIMER_TITLE          = "Disclaimer";
const HELP_TITLE                = "Notifying";
const HELP_MESSAGE              = "Nearby helpers have been notified";
const HELP_ERROR_NOTIFY         = "Please check your network connection\nIt is required to notify help";
const NOTIFY_HELP_ERROR_MESSAGE = "Unable to notify nearby, please check network connection and gps"
const ERROR_TITLE               = "Whoops!";
const REQUIRED_FIELD_TITLE      = "Required Field";
const RESEND_EMAIL              = "Resend email";
const DEFAULT_TITLE             = "TITLE";
const DEFAULT_MESSAGE           = "MESSAGE";
const CONFIRMATION_TITLE        = "Confirmation required";
const OKAY                      = "Okay";
const ACCEPT                    = "Accept";
const CANCEL                    = "Cancel";

const DISCLAIMER_TEXT             = "This app is not a replacement for calling emergency services.In case of an emergency, you should always contact your local emergency services.\nPreventanyl has the ability to contact nearby helpers and get directions to naloxone kits, and such ability is not guaranteed to function.";

export const GENERIC_ALERT_OBJECTS = Object.freeze (
    {
        OKAY : {
            text    : OKAY,
            onPress : () => {}
        },
        CANCEL : {
            text    : CANCEL,
            onPress : () => {}
        },
        UNDISSMISSABLE : {
            cancelable : false,
            onDismiss  : () => {}
        },
    }
)

export const genericAlert = (title, message) => {

    if (title === "" || message === "")
        return;

    Alert.alert (
        title, message, 
        [
            GENERIC_ALERT_OBJECTS.OKAY
        ],  
        
    )   

}

export const genericErrorAlert = (message) => {
    genericAlert(ERROR_TITLE, message);
}

export const genericErrorMessageAlert = (error) => {
    genericAlert(ERROR_TITLE, error.message);
}

export const genericErrorDescriptionAlert = (error) => {
    if (error === undefined || error === undefined || typeof error === "string")
        return;

    genericAlert(ERROR_TITLE, error.response.data.error_description);
}

export const genericRequiredFieldAlert = (field) => {
    genericAlert (REQUIRED_FIELD_TITLE, `Please enter a ${ field }`);
}

export const genericNotFormattedFieldAlert = (field) => {
    genericAlert (REQUIRED_FIELD_TITLE, `${ field } is not formatted properly`);
}

export const notifyHelpAlert = () => {
    genericAlert (HELP_TITLE, HELP_MESSAGE);
}

export const notifyHelpErrorAlert = () => {
    genericErrorAlert (HELP_ERROR_NOTIFY);
}

export const notifyHelplErrorAlertUnknown = () => {
    genericErrorAlert (NOTIFY_HELP_ERROR_MESSAGE);
}

export const genericVerificationAlert = (title, message) => {
    if (title === "" || message === "")
        return;

    if (!Database.checkUserVerfied ()) {
        Alert.alert (
            title,
            message,
            [
                GENERIC_ALERT_OBJECTS.RESEND_EMAIL,
                GENERIC_ALERT_OBJECTS.OKAY
            ],
            GENERIC_ALERT_OBJECTS.UNDISSMISSABLE
        );
    }
}

export const genericDefaultAlert = () => {
    genericAlert (DEFAULT_TITLE, DEFAULT_MESSAGE)
}

export const genericDisclaimerAlert = (func) => {
    Alert.alert (
        DISCLAIMER_TITLE,
        DISCLAIMER_TEXT,
        [
            {
                text : ACCEPT,
                onPress : () => {
                    func ();
                }
            }
        ]
    )
}
