import { createBrowserRouter } from "react-router-dom";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import ErrorPage from "./ErrorPage";
import Main from "./DashBoardLayouts/Main";
import DashBoard from "../Pages/Dashboard/DashBoradHome/DashBoard";
import DashBoardLayouts from "../Layouts/DashBoardLayouts/DashBoardLayouts";
import AllPatients from "../Pages/Dashboard/Patients/AllPatients";
import Doctors from "../Pages/Dashboard/Doctors/Doctors";
import PrivateRoute from "../PrivateRoutes/PrivateRoutes";
import AddAPatient from "../Pages/Dashboard/Patients/AddAPatient";
import UserProfile from "../Pages/Dashboard/Users/UserProfie/UserProfile";
import AllUser from "../Pages/Dashboard/Users/AllUser/AllUser";
import Appointment from "../Pages/Dashboard/Appointment/Appointment";
import MyAppointments from "../Pages/Dashboard/Doctors/MyAppointments";
import UpdatePassword from "../Pages/Dashboard/Users/UserProfie/UpdatePassword";
import UpdatePresciption from "../Pages/Dashboard/Presciption/UpdatePresciption";
import AllApointments from "../Pages/Dashboard/Appointment/AllApointments";
import CreateInvoice from "../Pages/Dashboard/Invoice/CreateInvoice";
import AllInvoice from "../Pages/Dashboard/Invoice/AllInvoice";
import NewPatientProfile from "../Pages/Dashboard/PatientProfile/NewPatientProfile";
import AllCategories from "../Pages/Dashboard/Categories/AllCategories";
import InvoicePage from "../Pages/Dashboard/Invoice/InvoicePage";
import CreateInvoiceCategory from "../Pages/Dashboard/Categories/CreateInvoiceCatagory";
import AllTest from "../Pages/Dashboard/Test/AllTest";
import UpdateTest from "../Pages/Dashboard/Test/UpdateTest";
import TestDetails from "../Pages/Dashboard/Test/TestDetails";
import AllExpense from "../Pages/Dashboard/Expense/AllExpense";
import CreateExpense from "../Pages/Dashboard/Expense/CreateExpense";
import ExpenseDetails from "../Pages/Dashboard/Expense/ExpenseDetails";
import UpdateExpense from "../Pages/Dashboard/Expense/UpdateExpense";
import AllExpenseCategories from "../Pages/Dashboard/Expense/Categories/AllExpenseCategories";
import CreateExpCat from "../Pages/Dashboard/Expense/Categories/CreateExpCat";
import ExpCatDetails from "../Pages/Dashboard/Expense/Categories/ExpCatDetails";
import UpdateExpCat from "../Pages/Dashboard/Expense/Categories/UpdateExpCat";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <DashBoardLayouts></DashBoardLayouts>
      </PrivateRoute>
    ),
    children: [
      {
        path: "/",
        element: (
          <DashBoard>
            <DashBoardLayouts></DashBoardLayouts>
          </DashBoard>
        ),
      },

      {
        path: "/patients",
        element: <AllPatients></AllPatients>,
      },
      {
        path: "/doctors",
        element: <Doctors></Doctors>,
      },
      {
        path: "/signup",
        element: <Register></Register>,
      },
      {
        path: "/addapatient",
        element: <AddAPatient></AddAPatient>,
      },
      {
        path: "/user/profile",
        element: <UserProfile></UserProfile>,
      },
      {
        path: "/alluser",
        element: <AllUser></AllUser>,
      },

      {
        path: "/appointment",
        element: <AllApointments></AllApointments>,
      },
      {
        path: "/appointment/:id",
        element: <Appointment></Appointment>,
      },
      {
        path: "/myappointment",
        element: <MyAppointments></MyAppointments>,
      },
      {
        path: "/updatepresciption/:id",
        element: <UpdatePresciption></UpdatePresciption>,
      },
      {
        path: "/createinvoice/:patientId",
        element: <CreateInvoice></CreateInvoice>,
      },

      {
        path: "/allinvoice",
        element: <AllInvoice></AllInvoice>,
      },
      {
        path: "/categories",
        element: <AllCategories></AllCategories>,
      },
      {
        path: "/tests",
        element: <AllTest></AllTest>,
      },
      {
        path: "/test/:testId",
        element: <UpdateTest></UpdateTest>,
      },
      {
        path: "/testDetails/:testId",
        element: <TestDetails></TestDetails>,
      },

      {
        path: "/category/new",
        element: <CreateInvoiceCategory></CreateInvoiceCategory>,
      },

      {
        path: "/expense/all",
        element: <AllExpense></AllExpense>,
      },

      {
        path: "/expense/new",
        element: <CreateExpense></CreateExpense>,
      },

      {
        path: "/expense/:expenseId",
        element: <ExpenseDetails></ExpenseDetails>,
      },

      {
        path: "/expense/update/:expenseId",
        element: <UpdateExpense></UpdateExpense>,
      },

      {
        path: "/expense/category/all",
        element: <AllExpenseCategories></AllExpenseCategories>,
      },

      {
        path: "/expense/category/new",
        element: <CreateExpCat></CreateExpCat>,
      },

      {
        path: "/expense/category/:categoryId",
        element: <ExpCatDetails></ExpCatDetails>,
      },

      {
        path: "/expense/category/update/:categoryId",
        element: <UpdateExpCat></UpdateExpCat>,
      },

      {
        path: "/payment/invoice/:invoiceId",
        element: <InvoicePage></InvoicePage>,
      },
      {
        path: "/payment/invoice/createinvoice",
        element: <CreateInvoice></CreateInvoice>,
      },
      {
        path: "/user/updatepassword",
        element: <UpdatePassword></UpdatePassword>,
      },
      {
        path: "/*",
        element: <ErrorPage></ErrorPage>,
      },
    ],
  },
  {
    path: "/user",
    element: <Main></Main>,
    children: [
      {
        path: "/user/login",
        element: <Login></Login>,
      },
    ],
  },
  {
    path: "/patient",
    element: <Main></Main>,
    children: [
      {
        path: "/patient/newpatientprofile/:id",
        element: <NewPatientProfile></NewPatientProfile>,
      },
    ],
  },
  {
    path: "/qr",
    element: <Main></Main>,
    children: [
      {
        path: "/qr/newpatientprofile/:id",
        element: <NewPatientProfile qr></NewPatientProfile>,
      },
      {
        path: "/qr/payment/invoice/:invoiceId",
        element: <InvoicePage></InvoicePage>,
      },
    ],
  },
]);
export default router;
