import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useForm } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/utils/validator";
import Card from "../../shared/components/UIElements/Card";
import "./PlaceForm.css";

const UpdatePlace = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState();
  const history = useHistory();
  const auth = useContext(AuthContext);
  const placeId = useParams().pid;
  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
        );
        setLoadedPlace(responseData.place);
        setFormData(
          {
            title: {
              value: responseData.places.title,
              isValid: true,
            },
            description: {
              value: responseData.places.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest, placeId, setFormData]);

  if (!loadedPlace && !isLoading) {
    return (
      <div className="center">
        <Card>
          <h2>Place not found!!</h2>
        </Card>
      </div>
    );
  }
  const submitHandler = async (event) => {
    event.preventDefault();
    console.log(formState.inputs.title.value);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push("/" + auth.userID + "/places");
    } catch (err) {}
  };
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlace && (
        <form className="place-form" onSubmit={submitHandler}>
          <Input
            id="title"
            type="text"
            element="input"
            label="Title"
            errorText="Please enter valid title!!"
            initialValue={loadedPlace.title}
            onInput={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            errorText="Please enter a valid description (Min. 5 characters)."
            initialValue={loadedPlace.description}
            onInput={inputHandler}
            validators={[VALIDATOR_MINLENGTH(5)]}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;
